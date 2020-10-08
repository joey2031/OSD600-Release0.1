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
let regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/igm

//console.log(process.argv[3]);

if (process.argv.length < 3) { // will always be at least 2
    console.log("ERROR: Please enter command line argument (name of file to be processed).");
} else {
    if (process.argv[2] == "v" || process.argv[2] == "version") {
        console.log(packageJson.name + " Version " + packageJson.version);
    } else {
        // Each index in the array stores a line in the file
        linesArr = fs.readFileSync(process.argv[2], 'utf8').split('\n');
        const linkArr = [];
        for (let i = 0; i < linesArr.length; i++) {
            if (regEx.test(linesArr[i])) { // if its true (match has been found)
                var result = linesArr[i].match(regEx); // store the match. **Create and populate variable** (exec did not work, had to use match instead)

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
        /*
           The every() method tests whether all elements in the array pass the test
           In this case check each result in the array is == true 
           console.log("All Good", data.every(result => result === true))

           Note: Calling process.exit() will force the process to exit as quickly as possible even if there
           are still asynchronous operations pending that have not yet completed fully, including I/O operations
           to process.stdout and process.stderr. In most situations, it is not actually necessary to call
           process.exit() explicitly src: https://nodejs.org/api/process.html#process_process_exit_code
        */

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
        const linkN = new URL(link).hostname;
        await dnsPromise(linkN);
        return isGood;
    } catch (err) {
        console.log(err);
    }
}