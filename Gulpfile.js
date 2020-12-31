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

const { polygon, featureCollection, feature } = require('@turf/helpers')
const { default: union } = require('@turf/union')
const { default: turfarea} = require('@turf/area')
const { kebabCase } = require('lodash')
const { default: polylabel } = require('polylabel')
const lazypipe = require('lazypipe')



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

function makeTransform2json(geojson)
{
    return function (content) {
        let json = content.replace(/^"|"$/, "").split("*").map((postcodes) => {
            const [label, coordinates] = postcodes.split("|")
            
            let multipolygon = coordinates.split("^").map((item) => {
                let polygon = item.split(" ").map((item) => {
                    return item.split(",").reverse().map((coor) => parseFloat(coor))
                })
    
                polygon.push(polygon[0])
    
                return polygon
            })

            if(geojson)
            {
                multipolygon = polygon(multipolygon, { label })
            }
    
            return [label, multipolygon]
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
    return del(['build/**'])
}

function pcPoly2GeoJson()
{
    return src('src/p/*.js')
        .pipe(flat2JsonTask(true))
        .pipe(rename({ extname: ".json" }))
        .pipe(dest(`build/postcodes`))
}

const regions = {
    "N Ireland": "BT",
    "Midlands": "CH,CW,HR,WR,DY,WV,TF,ST,WS,B,CV,DE,NG,LE,NN,PE,LN,NR",//"SY"
    "Wales": "NP,CF,SA,LL,LD,SY",
    "Scotland": "AB,DD,EH,FK,G,IV,KA,KW,KY,ML,PA,PH,TD,DG",
    "North West England": "CA,LA,BB,PR,BL,OL,M,SK,WA,WN,L,FY",
    "North East England": "NE,DH,SR,DL,TS,YO,HU,DN,S,HD,WF,HX,BD,LS,HG",
    "South East England": "OX,RG,SO,PO,GU,SL,HP,LU,MK,SG,AL,WD,HA,UB,TW,KT,RH,BN,TN,CT,ME,DA,BR,CR,SM,EN,CB,IP,CO,CM,SS,IG,RM",
    "South West England": "TR,PL,TA,DT,BH,SP,BA,BS,SN,GL,EX,TQ",
    "London": "EC,WC,W,SW,SE,E,N,NW"
}

function geojson__getCenter(feature)
{
    let center = []

    if(feature.properties.label === 'South East England')
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

function _generate_regions(data, addFile)
{
    const pM = Object.fromEntries(data)

    for (const [label, list] of Object.entries(regions)) {
        const basename = kebabCase(label)
        const postcodes = list.split(",")

        let combined

        for (const postcode of postcodes) {
            if(!!pM[postcode])
            {
                let feature = polygon(pM[postcode], { label: postcode })

                feature.properties.center = geojson__getCenter(feature)
                
                combined = !combined ? feature: union(combined, feature)

                addFile({ basename: postcode, group: label, content: JSON.stringify(feature) })
            }
        }

        combined.properties.label = label
        combined.properties.center = geojson__getCenter(combined)

        addFile({ basename, group: 'region', content: JSON.stringify(combined) })
    }
}

function combine_geojson(data)
{
    let features = []

    for (const [,item] of Object.entries(data)) {
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

exports.default = series(clean, parallel(pcPoly2GeoJson, generate_regions), deploy)