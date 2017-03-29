const config = require('./config.json');
const cwd = process.cwd();
const fs = require('fs');
const path = require('path');
const tplPath = path.resolve(cwd, 'scripts/README.md');
const readmePath = path.resolve(cwd, 'README.md');
const papersPath = path.resolve(cwd, 'papers');
const tpl = fs.readFileSync(tplPath, 'utf8').split('\n');
const md = fs.readFileSync(readmePath, 'utf8').split('\n');
const papers = fs.readdirSync(papersPath, 'utf8');

function groupingByYear(samples) {
    const dateReg = /(\d{4})-\d{1,2}-\d{1,2}/;
    const result = [];
    samples.forEach(function(it,id) {
        
    })
}
// const lines = md.split('\n');

console.log(papers);