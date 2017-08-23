#!/usr/bin/env node

//Require libraries
const chalk = require('chalk'); // Colored logging
var path = require('path'); // Path combining and other tools
var fs = require('fs'); // Filesystem

var folder = process.argv[2] || __dirname; // Specified folder (argument or current working directory)
var listing = []; // File listing entries

var entities = fs.readdirSync(folder); // Read entities from the folder

entities.forEach(function(entity, index){ // For each entity...
    var fullPath = path.join(folder, entity); // Get full path by combining folder path and filename (readdirSync only returns filename & extension, not full path)
    var entityStats = fs.lstatSync(fullPath); // Get "stats" of the entities (https://linux.die.net/man/2/lstat)
    if (entityStats.isFile()) { // If the entity is a file...
        listing[index] = {
            name: chalk.white(entity),
            type: "file"
        }; // Update listing with entity name (colored correctly), and entity type.
    }
    if (entityStats.isDirectory()) { // If the entity is a directory...
        listing[index] = {
            name: chalk.green(entity + "/"),
            type: "directory"
        }; // Update listing with entity name (colored correctly), and entity type.
    }
    if (entityStats.isSymbolicLink()) { // If the entity is a symbolic link...
        listing[index] = {
            name: chalk.blue(entity),
            type: "symlink"
        }; // Update listing with entity name (colored correctly), and entity type.
    }
    if (!entityStats.isDirectory()){ // If the entity is not a directory...
        listing[index].size = entityStats.size + "B"; // Add size to listing
    }
});

var maxlen = {
    name: 0,
    size: 0,
    type: "directory".length // NOTE: Update this if new type is added
}; // Maximum length variables

//Find maximum string lengths
listing.forEach(function(entity){ // For each entity in the listing...
    if (entity.name.length > maxlen.name) { maxlen.name = entity.name.length } // Update maxlen if the entity's name's length is bigger than the current value
    if (typeof entity.size != "undefined") { // If the entity size is specified...
        if (entity.size.length > maxlen.size) { maxlen.size = entity.size.length } // Update maxlen if the entity's size's length is bigger than the current value
    }
});

var maxLenFull = maxlen.name + " | ".length + maxlen.size + " | ".length + maxlen.type; // Calculate full length of the biggest line

var listingStr = "Directory listing in " + path.basename(folder); // path.basename returns the last bit of the path ("C:\test\hello.txt" would return "hello.txt", "C:\test\secondtest\" would return "secondtest")

//Work out text center
for (var i = 0; i < maxLenFull - listingStr.length; i++){ // Runs as many times as many characters listingStr is smaller than the maximum line length. If listingStr is bigger than the maximum line length, the loop doesn't run because the conditions don't match.
    if (i%2==0){ // If even number
        listingStr += " "; // Add space to end of string
    } else { // If odd number
        listingStr = " " + listingStr // Add space to start of string
    }
}

console.log(listingStr);

//Build entity strings
listing.forEach(function(entity){
    var entityString = entity.name; // Start off the entity string with the entity name
    for (var i = entity.name.length; i < maxlen.name; i++){entityString += " ";} // Add needed spaces to get to maxlen.name
    if (typeof entity.size != "undefined") { // If entity size is specified...
        entityString += " | "; // Add seperator to entityString
        entityString += entity.size; // Add size to entityString
    } else { // If entity size is not specified...
        entityString += "   "; // Add 3 spaces to entityString
        entity.size = ""; // Set the property to an empty string
    }
    for (var i = entity.size.length; i < maxlen.size; i++){entityString += " ";} // Add needed spaces to get to maxlen.size
    entityString += " | "; // Add separator to entityString
    entityString += entity.type; // Add type to entityString
    console.log(entityString);
});