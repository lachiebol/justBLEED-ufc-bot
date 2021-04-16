const got = require('got');
const { get } = require('http');
const jsdom = require("jsdom");
const sherdog = require('sherdog');
const { JSDOM } = jsdom;

//TODO ADD WEIGHT CLASSES


exports.getEvent = async function (event) {

    const path = await getSherdogLink(event)

    let link = await got(`https://www.sherdog.com${path}`)


    const dom = new JSDOM(link.body);
    const mainEventFighter = [...dom.window.document.querySelectorAll("div.fight > div.fighter > h3 > a > [itemprop=name]")];
    const mainEventResult = [...dom.window.document.querySelectorAll("div.fight > div.fighter > span.final_result")]
    const mainEventMethod = [...dom.window.document.querySelectorAll("table.resume > tbody > tr > td")]
    const fightersInEvent = [...dom.window.document.querySelectorAll('[itemprop=subEvent] > [itemprop=performer] > div.fighter_result_data > a > [itemprop=name]')];
    const winOrLose = [...dom.window.document.querySelectorAll('[itemprop=subEvent] > [itemprop=performer] > div.fighter_result_data > span')];
    const method = [...dom.window.document.querySelectorAll('[itemprop=subEvent] > td:not(.text_right):not(.text_left):not(.versus):not(.sub_line)')];
    let count = 0

    let fights = {}
    numFights = fightersInEvent.length / 2
    fightCount = numFights
    for(let i = 0; i < fightersInEvent.length; i+=2) {
        fights[fightCount] = {
            fighterOne: {
                name: fightersInEvent[i].textContent,
                result: winOrLose[i].textContent
            },

            fighterTwo: {
                name: fightersInEvent[i+1].textContent,
                result: winOrLose[i+1].textContent
            }
        }

        fightCount--;
    }

    fightCount = numFights
    for(let i = 0; i < method.length; i+=4) {
        fights[fightCount].method = method[i+1].textContent.split("\n")[0],
        fights[fightCount].round = method[i+2].textContent,
        fights[fightCount].time = method[i+3].textContent,
        

        fightCount--;
    }

    fights[numFights + 1] = {
        fighterOne: {
            name: mainEventFighter[0].textContent,
            result: mainEventResult[0].textContent
        },

        fighterTwo: {
            name: mainEventFighter[1].textContent,
            result: mainEventResult[1].textContent
        },

        method: mainEventMethod[1].textContent.split(" ")[1],
        round: mainEventMethod[3].textContent.split(" ")[1],
        time: mainEventMethod[4].textContent.split(" ")[1]
    }

    


    return fights
 
}

this.getEvent("Brunson vs Holland").then(
    (data) => {
        console.log(data);
    }
)

async function getSherdogLink (eventName) {
    
    //Format search strings to fit URLS
    const eventSearch = eventName.split(" ").join('+').split("'").join("%27");
    let eventPage = eventName.split(" ").join('-').split("'").join("");

    const searchUrl= `https://www.sherdog.com/stats/fightfinder?SearchTxt=${eventSearch}&weight=&association=`;
    console.log(searchUrl);
    let link = await got(searchUrl);
    
    const dom = new JSDOM(link.body);
    const nodeList = [...dom.window.document.querySelectorAll('table.fightfinder_result > tbody > tr > td > a')];

    for(let path of nodeList) {
        if(path.href.includes(`${eventPage}`)){
            return path.href
        }
    } 
}

