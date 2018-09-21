'use strict';

const path = require('path');
const baseDir = path.resolve(__dirname);
// const rundir = path.resolve(__dirname, '../../');
const getOptions = clusterPort => {
  return {
    baseDir,
    rundir: baseDir,
    clusterPort,
  };
};


module.exports = getOptions;
