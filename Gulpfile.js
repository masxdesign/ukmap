const { src, dest, series, parallel } = require('gulp')
const del = require('del')
const rename = require("gulp-rename")
const replace = require('gulp-string-replace')
const change = require('gulp-change')
const gulpif = require('gulp-if')

const jsoncombine = require("gulp-jsoncombine")

const path = require('path')
const through2 = require('through2')
const File = require('vinyl')
const vftp = require( 'vinyl-ftp' )

const { polygon, featureCollection, multiPolygon } = require('@turf/helpers')
const { default: union } = require('@turf/union')
const { default: turfarea} = require('@turf/area')
const { kebabCase } = require('lodash')
const { default: polylabel } = require('polylabel')
const lazypipe = require('lazypipe')

const E15 = require('./src/r/E15.json')
const PE31 = require('./src/r/PE31.json')

function splitfiles(preprocessor)
{
    return through2.obj(function(file, enc, next){
		var data = JSON.parse(file.contents.toString('utf8'));
        var base1 = path.join(file.path, '..');
        
        const addFile = ({ basename, base = base1, extname = ".json", content, ...props }) => {
            var first = new File({
                ...props,
                base: base,
                path: path.join(base, `${basename}${extname}`),
                contents: new Buffer.from(content)
            })
            this.push(first)
        }

        preprocessor(data, addFile)

		next();
	})
}

function geojson__getCenter(feature)
{
    let center = []

    if(feature.properties.name === 'South East England')
    {
        return [51.94540024,-0.01763881]
    }

    if(feature.geometry.type === "Polygon"){
        center = polylabel(feature.geometry.coordinates)
    }
    else 
    {
        let maxArea = 0, maxPolygon = [];

        for (let i = 0; i < feature.geometry.coordinates.length; i++)
        {
            const p = feature.geometry.coordinates[i];
            const area = turfarea({type: "Polygon", coordinates: p})

            if (area > maxArea)
            {
                maxPolygon = p;
                maxArea = area;
            }
        }

        center = polylabel(maxPolygon, '1.0')
    }

    return center.reverse()
}

function makeTransform2json(geojson)
{
    return function (content) {
        let json = content.replace(/^"|"$/, "").split("*").map((postcodes) => {
            const [name, coordinates] = postcodes.split("|")
            
            let multipolygon = coordinates.split("^").map((item) => {
                let polygon = item.split(" ").map((item) => {
                    return item.split(",").reverse().map((coor) => parseFloat(coor))
                })
    
                polygon.push(polygon[0])
    
                return polygon
            })

            if(geojson)
            {
                multipolygon = polygon(multipolygon, { name })
            }
    
            return [name, multipolygon]
        })

        json = json.map((item) => {
            
            const [name] = item
            
            if(name === 'E15') 
                return [name, geojson ? E15: []]
            
            if(name === 'PE31') 
                return [name, geojson ? PE31: []]
            
            return item
        })

        if(geojson)
        {
            json = featureCollection(json.map(([, multipolygon]) => {
                return multipolygon
            }))
        }
    
        return JSON.stringify(json)
    }
}

const flat2JsonTask = (geojson) => lazypipe()
    .pipe(replace, /^pc\(|\)$/i, '')
    .pipe(() => change(makeTransform2json(geojson)))()

function clean()
{
    return del(['build/**', '../postcodemap/src/data/**'], { force: true })
}

// function pcPoly2GeoJson()
// {
//     return src('src/p/*.js')
//         .pipe(flat2JsonTask(true))
//         .pipe(rename({ extname: ".json" }))
//         .pipe(dest(`build/postcodes`))
// }

const regions = {
    "N Ireland": "BT",
    "Midlands": "CH,CW,HR,WR,DY,WV,TF,ST,WS,B,CV,DE,NG,LE,NN,PE,LN,NR",
    "Wales": "NP,CF,SA,LL,LD,SY",
    "Scotland": "AB,DD,EH,FK,G,IV,KA,KW,KY,ML,PA,PH,TD,DG,HS,ZE",
    "North West England": "CA,LA,BB,PR,BL,OL,M,SK,WA,WN,L,FY",
    "North East England": "NE,DH,SR,DL,TS,YO,HU,DN,S,HD,WF,HX,BD,LS,HG",
    "South East England": "OX,RG,SO,PO,GU,SL,HP,LU,MK,SG,AL,WD,HA,UB,TW,KT,RH,BN,TN,CT,ME,DA,BR,CR,SM,EN,CB,IP,CO,CM,SS,IG,RM",
    "South West England": "TR,PL,TA,DT,BH,SP,BA,BS,SN,GL,EX,TQ",
    "London": "EC,WC,W,SW,SE,E,N,NW"
}

function single_postcodes_transfer()
{
    function modify(name, data)
    {
        data.name = name
        data.features.forEach((feature) => {
            const { name } = feature.properties
            
            if(feature.geometry.type === 'GeometryCollection')
            {
                feature.geometry = multiPolygon(feature.geometry.geometries.map((item) => item.coordinates)).geometry
            }

            feature.properties = { name, center: geojson__getCenter(feature) }
        })

        return JSON.stringify(data)
    }

    return src('src/g/*.geojson')
        .pipe(through2.obj(function(file, enc, next)
        {
            const name = file.basename.replace(file.extname, '')

            let data = JSON.parse(file.contents.toString('utf8'))

            file.contents = new Buffer.from(modify(name, data))

            next(null, file)
        }))
        .pipe(rename({ extname: ".json" }))
        .pipe(dest(`build/postcodes`))
}

function _generate_regions(data, addFile)
{
    const pM = Object.fromEntries(data)

    for (const [name, list] of Object.entries(regions)) {
        const basename = kebabCase(name)
        const postcodes = list.split(",")

        let combined

        for (const postcode of postcodes) {
            if(!!pM[postcode])
            {
                let feature = polygon(pM[postcode], { name: postcode })

                feature.properties.center = geojson__getCenter(feature)
                
                combined = !combined ? feature: union(combined, feature)

                addFile({ basename: postcode, group: name, content: JSON.stringify(feature) })
            }
        }

        combined.properties.name = name
        combined.properties.center = geojson__getCenter(combined)

        addFile({ basename, group: 'region', content: JSON.stringify(combined) })
    }
}


function postcode_index()
{
    return src('src/g/*.geojson')
        .pipe(rename({ extname: '.json' }))
        .pipe(jsoncombine('postcode-index.json', function(data){

            let map = []
            let reg = Object.entries(regions).map(([regionName, str]) => ([regionName, str.split(',')]))

            for (let [postcodeArea, item] of Object.entries(data)) {
                const r = reg.findIndex(([, items]) => items.includes(postcodeArea))
                
                if(r < 0) {
                    throw new Error(postcodeArea)
                }

                const a = reg[r][1].indexOf(postcodeArea)

                for(let feature of item.features)
                {
                    const { name } = feature.properties

                    map.push([name, postcodeArea, a, r])
                }
            }

            return Buffer.from(JSON.stringify(map))

        }))
        .pipe(dest('build/'))
}

// build/codes/

function combine_geojson(data)
{
    let features = []

    for (let [, item] of Object.entries(data)) {
        features.push(item)
    }

    return new Buffer.from(JSON.stringify(featureCollection(features)))
}

function generate_geojson() 
{
    let pipeline = lazypipe()
    
    Object.keys(regions).forEach((groupname) => {

        pipeline = pipeline.pipe(() => {
            const filename = kebabCase(groupname)
            const lazyDest = lazypipe()
                .pipe(jsoncombine, `${filename}.json`, combine_geojson)
                .pipe(dest, 'build/codes/')
    
            return gulpif((file) => file.group === groupname, lazyDest())
        })
        
    })
    
    pipeline = pipeline.pipe(() => {
        const lazyDest = lazypipe()
            .pipe(jsoncombine, `regions.json`, combine_geojson)
            .pipe(dest, 'build/')

        return gulpif((file) => file.group === 'region', lazyDest())
    })
    
    return pipeline()
}

function generate_regions(cb)
{
    src('src/mp.js')
        .pipe(flat2JsonTask())
        .pipe(splitfiles(_generate_regions))
        .pipe(generate_geojson())
        .on('end', cb);
}

function deploy()
{
    return src('build/**')
        .pipe(dest('../postcodemap/src/data/'))
}

function ftp_deploy()
{
    require('gulp-env')({
        file: '.env',
        type: 'ini',
    })

    const conn = vftp.create({
        host:       process.env.HOST,
        user:       process.env.USER,
        password:   process.env.PASSWORD,
        parallel:   10,
        port:       21,
        log:        console.log
    })

    return src('build/**', { base: 'build', buffer: false })
        .pipe(conn.newer('/postcodemapgeojson'))
        .pipe(conn.dest('/postcodemapgeojson'))
}

exports.default = series(clean, parallel(single_postcodes_transfer, generate_regions, postcode_index), parallel(deploy, ftp_deploy))
exports.ftp_deploy = ftp_deploy