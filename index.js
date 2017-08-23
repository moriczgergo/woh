#!/usr/bin/env node

//Require libraries
const chalk = require('chalk'); // Colored logging
var fs = require('fs'); // Filesystem

var folder = process.argv[2] || __dirname; // Specified folder (argument or current working directory)