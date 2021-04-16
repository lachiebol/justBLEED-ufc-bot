const got = require('got');
const { get } = require('http');
const jsdom = require("jsdom");
const sherdog = require('sherdog');
const { JSDOM } = jsdom;

/**
 * @TODO Dong Hyun Ma does not work. Have to look into fighters with odd names
 */

/**
 * Gets fighter sherdog link by getting HTML from sherdog's fight finder webpage. Looks for paths containing fighter name
 * @param {String} fighterName name of fighter
 * @returns Promise with data containing sherdog fighter path 
 */
async function getSherdogLink (fighterName) {
    
    //Format search strings to fit URLS
    const fighterSearch = fighterName.split(" ").join('+').split("'").join("%27");
    let fighterPage = fighterName.split(" ").join('-').split("'").join("");

    const searchUrl= `https://www.sherdog.com/stats/fightfinder?SearchTxt=${fighterSearch}&weight=&association=`;

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

/**
 * Wraps sherdog get fighter function in a promise so await can be used.
 * @param {String} url Sherdog fighter page url 
 * @returns {Promise} promise format of sherdog get fighter
 */
function sherdogPromiseWrapper(url) {
    return new Promise((resolve, reject) => {
        sherdog.getFighter(url, (successResponse) => {
            resolve(successResponse);
        })
    });
}

/**
 * Gets fighter data from sherdog, calls helper functions above to get all required variables
 * @param {String} fighterName Name of fighter user want's to search
 * @returns Promise with all fighter data
 */
exports.getFighterData = async function  (fighterName) {
    let path = await getSherdogLink(fighterName);

    var url = `http://www.sherdog.com/${path}`

    let data = await sherdogPromiseWrapper(url);

    return data;
}

