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
const colors = require('colors'); // TODO see if I can take out
const util = require('util');
const dns = require('dns'); //dns resolver
const { resolve } = require('path');
const dnsPromise = util.promisify(dns.resolve);
const rrtype = "AAAA" //IPv6 address
let allGood = true; // assume all links are good




let linesArr = [];
let regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/igm


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

        makeCalls(linkArr).then((data) => {
            console.log(allGood)
            console.log("Done");
            console.log("All Good", data.every(result => result === true))
        }).catch((err) => {
            console.log(err)
        });

    }
}

function makeCalls(links) {
    async function processLink(link) {
        try {
            const response = await fetch(link, { method: "HEAD" });
            let isGood = false;

            if (response.status == 200) { // good
                console.log(`${link} was good! status: ${response.status}`.green);
                isGood = true;
            } else if (response.status == 404 || response.status == 401) { // bad
                console.log(`${link} was bad! status: ${response.status}`.red);
            } else { // unknown
                console.log(`${link} was unknown! status: ${response.status}`.gray);
            }
    
            const linkN = new URL(link).hostname;
            await dnsPromise(linkN);
            return isGood;
        } catch(err) {
            console.log(err);
        }
    }
    
    return Promise.all(links.map(processLink));
}
