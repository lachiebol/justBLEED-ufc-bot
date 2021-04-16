const fs = require('fs');
const got = require('got');
const { get } = require('http');
const jsdom = require("jsdom");
const sherdog = require('sherdog');
const { JSDOM } = jsdom;



async function getSherdogLink (fighterName) {
    
    const fighterSearch = fighterName.split(" ").join('+').split("'").join("%27");
    let fighterPage = fighterName.split(" ").join('-').split("'").join("");;
    const searchUrl= `https://www.sherdog.com/stats/fightfinder?SearchTxt=${fighterSearch}&weight=&association=`;


    console.log(searchUrl);
    let links = []
    let link = await got(searchUrl);
    

    const dom = new JSDOM(link.body);
    const nodeList = [...dom.window.document.querySelectorAll('a')];

    for(let path of nodeList) {
        console.log(path.href);
        if(path.href.includes(`fighter/${fighterPage}`)){
            return path.href
        }
    } 
}

// myFunction wraps the above API call into a Promise
// and handles the callbacks with resolve and reject
function sherdogPromiseWrapper(url) {
    return new Promise((resolve, reject) => {
        sherdog.getFighter(url, (successResponse) => {
            resolve(successResponse);
        })
    });
}

exports.getFighterData = async function  (fighterName) {
    let path = await getSherdogLink(fighterName);

    var url = `http://www.sherdog.com/${path}`

    let data = await sherdogPromiseWrapper(url);

    return data;
}

