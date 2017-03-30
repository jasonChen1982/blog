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
            const year = keys[1];
            if (year !== preCache.year) {
                if (preCache.year) {
                    result.push(Object.assign({}, preCache));
                }
                preCache.year = year;
                preCache.papers = [];
            }
            preCache.papers.push(warpPaper(it));
        }
    })
    result.push(Object.assign({}, preCache));
    return result;
}

function warpPaper(paper) {
    const result = {};
    let mark = ' ';
    result.finished = checkStatus(paper);
    result.paper = paper;
    result.title = paper.replace(/(\d{4})-\d{1,2}-\d{1,2}-|\.md/g, '');
    result.url = encodeURI(config.prefix + paper);
    mark = result.finished ? 'x' : ' ';
    result.item = `- [${mark}] [${result.title}](${result.url})`;
    return result;
}

function checkStatus(paper) {
    let result = false;
    const reg = /\-\s\[(\s|x)]\s/;
    md.forEach(function (it, id) {
        if (reg.test(it) && it.indexOf(paper) > -1) {
            const place = it.match(reg)[1];
            result = place === 'x' ? true : false ;
        }
    })
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
            preYear = paper.year;
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

exports.groupingByYear = groupingByYear;
exports.updatedMD = updatedMD;
