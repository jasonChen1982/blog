const config = require('./config.json');
const cwd = process.cwd();
const fs = require('fs');
const path = require('path');

const readmePath = path.resolve(cwd, 'README.md');
const md = fs.readFileSync(readmePath, 'utf8').split('\n');

function groupingByYear(samples) {
    const dateReg = /(\d{4})-\d{1,2}-\d{1,2}/;
    const result = [];
    const preCache = {};
    samples.forEach(function (it, id) {
        const keys = it.match(dateReg);
        if (keys && keys.length > 1) {
            const times = keys[0].replace(/-/g, '') - 0;
            const time = keys[1] - 0;
            if (time !== preCache.time) {
                if (preCache.time) {
                    ship();
                }
                preCache.time = time;
                preCache.papers = [];
            }
            preCache.papers.push(warpPaper(it, times));
        }
    })
    ship();
    sortFn(result, config.sortOrder.years);

    function ship(){
        sortFn(preCache.papers, config.sortOrder.papers);
        result.push(Object.assign({}, preCache));
    }
    return result;
}


function warpPaper(paper, time) {
    const result = {};
    let mark = ' ';
    result.finished = checkStatus(paper);
    result.paper = paper;
    result.title = paper.replace(/(\d{4})-\d{1,2}-\d{1,2}-|\.md/g, '');
    result.time = time;
    result.url = encodeURI(config.prefix + paper);
    mark = result.finished ? 'x' : ' ';
    result.item = `- [${mark}] [${result.title}](${result.url})`;
    return result;
}

function checkStatus(paper) {
    const paperFile = fs.readFileSync(path.resolve(cwd, 'papers', paper), 'utf8');
    const reg = /\nstatus:\s?(\w+)\s?\n?/;
    const regFinished = /finish(ed)?/;
    let result = false;
    if (reg.test(paperFile)) {
        result = regFinished.test(paperFile.match(reg)[1]) ? true : false ;
    }
    return result;
}

function updatedMD(papers) {
    const reg = /^### Papers of/;
    let index = md.length;
    for (let i = 0; i < index; i++) {
        if (reg.test(md[i])) {
            index = i;
            break;
        }
    }
    const result = md.slice(0, index);
    let preYear = 0;
    for (let j = 0; j < papers.length; j++) {
        const paper = papers[j];
        if (paper.year !== preYear) {
            preYear = paper.time;
            result.push('### Papers of ' + preYear);
            result.push('');
        }
        paper.papers.forEach(function(it){
            result.push(it.item);
        })
        result.push('');
    }

    fs.writeFileSync(readmePath, result.join('\n'));
}


function sortFn(arr, order) {
    arr.sort((a, b)=>{
        if (a.time < b.time) {
            return order;
        }
        if (a.time > b.time) {
            return -order;
        }
        return 0;
    });
}

exports.groupingByYear = groupingByYear;
exports.updatedMD = updatedMD;
