const { src, dest, series, parallel } = require('gulp')
const del = require('del')
const rename = require("gulp-rename")
const replace = require('gulp-string-replace')
const change = require('gulp-change')

const jsoncombine = require("gulp-jsoncombine")

const path = require('path')
const through2 = require('through2')
const File = require('vinyl')

const { polygon } = require('@turf/helpers')
const { default: union } = require('@turf/union')
const { kebabCase } = require('lodash')


function splitfiles(preprocessor){
    return through2.obj(function(file, enc, next){
		var data = JSON.parse(file.contents.toString('utf8'));
		var base = path.join(file.path, '..');

        const addFile = ({ basename, extname = ".json", content }) => {
            var first = new File({
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
    return (content) => {
        let json = content.replace(/^"|"$/, "").split("*").map((postcodes) => {
            const [label, coordinates] = postcodes.split("|")
            
            let multipolygon = coordinates.split("^").map((item) => {
                let polygon = item.split(" ").map((item) => {
                    return item.split(",").reverse().map((coor) => parseFloat(coor))
                })
    
                polygon.push(polygon[0])
    
                return polygon
            })

            if(geojson) multipolygon = polygon(multipolygon)
    
            return [label, multipolygon]
        })

        if(geojson) json = Object.fromEntries(json)
    
        return JSON.stringify(json)
    }
}

function convert(source, buildDir, json, geojson){
    let res = src(`src/${source}`)
        .pipe(replace(/^pc\(|\)$/i, ""))
    
    if(json) res = res.pipe(change(makeTransform2json(geojson)))
        
    return res.pipe(rename({ extname: ".json" }))
        .pipe(dest(`build/${buildDir}`))
}

function clean()
{
    return del(['build/**'])
}

function ukpoly2Flat()
{
    return convert("mp.js", "flat")
}

function ukpoly2Json()
{
    return convert("mp.js", "json", true)
}

function pcPoly2Flat()
{
    return convert("p/*.js", "flat/pc")
}

function pcPoly2Json()
{
    return convert("p/*.js", "json/pc", true)
}

// function pcPoly2GeoJson()
// {
//     return convert("p/*.js", "geojson", true, true)
// }

function _generate_regions(data, addFile)
{
    const regions = {
        "N Ireland": "BT",
        "Midlands": "CH,CW,HR,WR,DY,WV,TF,ST,WS,B,CV,DE,NG,LE,NN,PE,LN,NR",//"SY"
        "Wales": "NP,CF,SA,LL,LD,SY",
        "Scotland": "AB,DD,EH,FK,G,IV,KA,KW,KY,ML,PA,PH,TD",
        "North West England": "CA,LA,BB,PR,BL,OL,M,SK,WA,WN,L",
        "North East England": "NE,DH,SR,DL,TS,YO,HU,DN,S,HD,WF,HX,BD,LS,HG",
        "South East England": "OX,RG,SO,PO,GU,SL,HP,LU,MK,SG,AL,WD,HA,UB,TW,KT,RH,BN,TN,CT,ME,DA,BR,CR,SM,EN,CB,IP,CO,CM,SS,IG,RM",
        "South West England": "TR,PL,TA,DT,BH,SP,BA,BS,SN,GL,EX,TQ",
        "London": "EC,WC,W,SW,SE,E,N,NW"
    }

    const pM = Object.fromEntries(data)

    for (const [name, list] of Object.entries(regions)) {
        const basename = kebabCase(name)
        const postcodes = list.split(",")

        let combined

        for (const postcode of postcodes) {
            if(!!pM[postcode])
            {
                poly = polygon(pM[postcode])
                combined = !combined ? poly: union(combined, poly)

                addFile({ basename: postcode, content: JSON.stringify(poly) })
            }
        }

        addFile({ basename, content: JSON.stringify(combined) })
    }
}

function combine_SY_UK(data)
{  
    let json = []

    for (const [, item] of Object.entries(data)) {
        json = [ ...json, ...item]
    }

    return new Buffer.from(JSON.stringify(json))
}

function generate_regions()
{
    return src(["build/json/mp.json", "build/json/pc/SY.json"])
        .pipe(jsoncombine("sy_uk.json", combine_SY_UK))
        .pipe(splitfiles(_generate_regions))
        .pipe(dest("build/regions/"))
}

exports.default = series(clean, parallel(ukpoly2Flat, ukpoly2Json, pcPoly2Flat, pcPoly2Json), generate_regions)