/*
- Built in node functionality to get command line args. Src: https://stackabuse.com/command-line-arguments-in-node-js/#:~:text=command()%20option%2C%20which%20helps,argv)%20%3D%3E%20%7B%20console. 
- Beginner guide to RegEx: https://blog.bitsrc.io/a-beginners-guide-to-regular-expressions-regex-in-javascript-9c58feb27eb4
- RegEx checker with regEx for http and https links: https://www.regexpal.com/?fam=104034
- Top 15 Commonly Used Regex: https://digitalfortress.tech/tricks/top-15-commonly-used-regex/
2 ways to make a regular expression in Javascript.
var regexConst = new RegExp('abc');
var regexLiteral = /abc/;
*/


/*first index contains the path to our node executable, second index contains the path to the script file
rest of the indexes contain the arguments that we passed in their respective sequence.*/
const packageJson = require('./package.json');
const fetch = require("node-fetch"); // to get program version
const fs = require('fs');
const colors = require('colors');
const util = require('util');
const dns = require('dns'); //dns resolver
const { resolve } = require('path');
const dnsPromise = util.promisify(dns.resolve);
const rrtype = "AAAA" //IPv6 address
let linesArr = [];
let linkArr = [];
let ignoreLinks = [];
let regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/igm


if (process.argv.length < 3) { // will always be at least 3
    console.log("ERROR: Please enter command line argument (name of file to be processed).");
} else {
    if (process.argv[2] == "v" || process.argv[2] == "version") {
        console.log(packageJson.name + " Version " + packageJson.version);
    } else if (process.argv[2] == "--ignore"){
        //file with ignore links, argv[4] will be the link to process
        const file = process.argv[3];
        ignoreLinks = fs.readFileSync(file, 'utf-8').split('\n');
        ignoreLinks = ignoreLinks.filter(w => !w.startsWith('#'));
        ignoreLinks = ignoreLinks.filter(w => !w.startsWith("www."));
        //console.log(ignoreLinks);
        //console.log(ignoreLinks.length);
        if(ignoreLinks.length == 0){
            console.log("Invalid file, file cannt contain only comments (#) and invalid URLs")
            process.exitCode = 1;
        } else{
            populateLinkArr();
            makeCalls(linkArr).then((data) => { // pass in linkArr return data (array of booleans)
                if (data.every(result => result === true)) {
                    console.log("exit with 0 for good - Note if using flag output of links may not be accurate");
                    process.exitCode = 0; // better way instead of  process.exit() 
                } else {
                    console.log("exit with 1 for bad- Note if using flag output of links may not be accurate");
                    process.exitCode = 1;
                }
            }).catch((err) => {
                console.log(err)
            });
        }

    } else {
        populateLinkArr();
        makeCalls(linkArr).then((data) => { // pass in linkArr return data (array of booleans)
            if (data.every(result => result === true)) {
                console.log("exit with 0 for good - Note if using flag output of links may not be accurate");
                process.exitCode = 0; // better way instead of  process.exit() 
            } else {
                console.log("exit with 1 for bad- Note if using flag output of links may not be accurate");
                process.exitCode = 1;
            }
        }).catch((err) => {
            console.log(err)
        });
    }

}

// Promise.all will take an array of promises and returns a single Promise that 
// resolves to an array of the results of the input promises. (really just returning an 
// array of resolved promises). links.map(processLink) creates a new array 
// populated with these results. We could of done it like this or using an
// arrow function inside.
// links is an array, go through every element and call processLink function
// then promise.all will go through the returned array from map and returns a single Promise 
function makeCalls(links) {
    return Promise.all(links.map(processLink)); 
}

async function processLink(link) {
    try {
        const response = await fetch(link, { method: "HEAD" });
        let isGood = false;

        if(ignoreLinks.length != 0){
            console.log("joey");
            console.log("ignore links");
            console.log(ignoreLinks);

            // Need to trim since every line ends with \r
            var trimmedArr = ignoreLinks.map(s => s.trim())
            console.log("trimmedArr:");
            console.log(trimmedArr);

        // Stack overflow: https://stackoverflow.com/questions/34901593/how-to-filter-an-array-from-all-elements-of-another-array
        // Filter using the trimmed array since that matches the links grabed by the RegEx
        var filtered = linkArr.filter(f => !trimmedArr.includes(f)) // f repersents ignoreLinks
        console.log("filtered");
        console.log(filtered);
        // call for each on new array with filter on it
        filtered.forEach((link)=>{
            fetch(link,{method:'HEAD',timeout:2000})
            .then((res)=>{
                if(res.status==200){
                    console.log(`INSIDE FILTERED.FOREACH${link} was good! status: ${response.status}`.green);
                }
                
                if(res.status==400||res.status==404){
                    console.log(`INSIDE FILTERED.FOREACH ${link} was bad! status: ${response.status}`.red);
                }

            }).catch((error)=>{
                console.log("404",link.red)
            })
        })
        } else{ // check for --good --bad
            if (process.argv[3] == "--good") {
                if (response.status == 200) { // good
                    console.log(`${link} was good! status: ${response.status}`.green);
                    isGood = true;
                }
            } else if (process.argv[3] == "--bad") {// Here we dont care about the good ones so no need to worry about isGood
                if (response.status == 404 || response.status == 401) { // bad
                    console.log(`${link} was bad! status: ${response.status}`.red);
                }
            } else { // all
                if (response.status == 200) { // good
                    console.log(`${link} was good! status: ${response.status}`.green);
                    isGood = true;
                } else if (response.status == 404 || response.status == 401) { // bad
                    console.log(`${link} was bad! status: ${response.status}`.red);
                } else { // unknown
                    console.log(`${link} was unknown! status: ${response.status}`.gray);
                }
    
            }

        }
        const linkN = new URL(link).hostname;
        await dnsPromise(linkN);
        return isGood;
    } catch (err) {
        console.log(err);
    }
}

function populateLinkArr(){
    let processFile = "";
    if(process.argv[2] == "--ignore"){ // file position changes depending if we have --igronr oe not
        processFile = process.argv[4];
    } else{
        processFile = process.argv[2];
    }

     // Each index in the array stores a line in the file
     linesArr = fs.readFileSync(processFile, 'utf8').split('\n');
     for (let i = 0; i < linesArr.length; i++) {
         if (regEx.test(linesArr[i])) { // if its true (match has been found)
             var result = linesArr[i].match(regEx); // store the match. **Create and populate variable** 

             // If result.length is > then 1 (have more then one link on one line) we need to grab each index.
             if (result.length > 1) {
                 for (let i = 0; i < result.length; i++) {
                     linkArr.push(result[i]);
                 }
             } else {
                 linkArr.push(result); // push into array 
             }
         }
     }
            
}
