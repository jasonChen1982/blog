const util = require('./util');
const cwd = process.cwd();
const fs = require('fs');
const path = require('path');

const papersPath = path.resolve(cwd, 'papers');
const paperFiles = fs.readdirSync(papersPath, 'utf8');

const papers = util.groupingByYear(paperFiles);
util.updatedMD(papers);
