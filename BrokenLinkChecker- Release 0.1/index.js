// Note: to debug click icon with bug and play button, set break point click JavaScript debug terminal
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
const packageJson = require("./package.json");
const fetch = require("node-fetch"); // to get program version
const fs = require("fs");
const colors = require("colors");
const util = require("util");
const dns = require("dns"); //dns resolver
const { resolve } = require("path");
const { Console } = require("console");
const dnsPromise = util.promisify(dns.resolve);
const rrtype = "AAAA"; //IPv6 address
let linkArr = [];
let ignoreLinks = [];

const regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/gim;

// Functions
const makeCalls = (links) => Promise.all(links.map(processLink));
const populateLinkArr = () => {
  let processFile = "";
  if (process.argv[2] == "--ignore") {
    // file position changes depending if we have --igrone or not
    processFile = process.argv[4];
  } else if (process.argv[2] == "--telescope") {
    // telescope must be running for this to work!
    processFile = "telescopeText.txt";
  } else {
    processFile = process.argv[2];
  }

  // Each index in the array stores a line in the file
  fs.readFileSync(processFile, "utf8")
    .split(/\r?\n/)
    .forEach((line) => {
      // grab links
      if (!regEx.test(line)) {
        // no match
        return;
      }
      let urls = line.match(regEx); // store links in temp array urls
      linkArr = linkArr.concat(urls); // creates a new array consisting of the elements in the object on which it is called
      linkArr.splice(0, linkArr.length, ...new Set(linkArr)); // remove duplicates
    });
};

if (process.argv.length < 3) {
  // will always be at least 3
  console.log(
    "ERROR: Please enter command line argument (name of file to be processed).",
  );
} else if (process.argv[2] == "--ignore") {
  // node index.js --ignore ignore.txt test2.txt
  //file with ignore links, argv[4] will be the link to process
  const file = process.argv[3];
  ignoreLinks = fs
    .readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .filter(
      (line) =>
        line.startsWith("http://") || line.startsWith("https://"),
    );
  if (ignoreLinks.length == 0) {
    console.log(
      "Invalid file, file cannot contain only comments (#) and invalid URLs",
    );
    process.exitCode = 1;
  } else {
    populateLinkArr();
    // Stack overflow: https://stackoverflow.com/questions/34901593/how-to-filter-an-array-from-all-elements-of-another-array
    // Filter using the trimmed array since that matches the links grabbed by the RegEx
    var filtered = linkArr.filter(
      (link) => !ignoreLinks.includes(link),
    );

    makeCalls(filtered).then((data) => {
      if (data.every((result) => result === true)) {
        console.log(
          "exit with 0 for good - Note if using flag output of links may not be accurate",
        );
        process.exitCode = 0; // better way instead of  process.exit()
      } else {
        console.log(
          "exit with 1 for bad- Note if using flag output of links may not be accurate",
        );
        process.exitCode = 1;
      }
    });
  }
} else if (process.argv[2] == "--telescope") {
  getTelescope();
} else {
  populateLinkArr();
  makeCalls(linkArr)
    .then((data) => {
      // pass in linkArr return data (array of booleans)
      if (data.every((result) => result === true)) {
        console.log(
          "exit with 0 for good - Note if using flag output of links may not be accurate",
        );
        process.exitCode = 0; // better way instead of  process.exit()
      } else {
        console.log(
          "exit with 1 for bad- Note if using flag output of links may not be accurate",
        );
        process.exitCode = 1;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// This will get called for every element in the array
async function processLink(link) {
  try {
    // get status of each link
    const response = await fetch(link, { method: "HEAD" });
    let isGood = false;

    if (process.argv[3] == "--good") {
      // check for --good --bad
      if (response.status == 200) {
        // good
        console.log(
          `${link} was good! status: ${response.status}`.green,
        );
        isGood = true;
      }
    } else if (process.argv[3] == "--bad") {
      // Here we dont care about the good ones so no need to worry about isGood
      if (response.status == 404 || response.status == 401) {
        // bad
        console.log(
          `${link} was bad! status: ${response.status}`.red,
        );
      }
    } else {
      // all
      if (response.status == 200) {
        // good
        console.log(
          `${link} was good! status: ${response.status}`.green,
        );
        isGood = true;
      } else if (response.status == 404 || response.status == 401) {
        // bad
        console.log(
          `${link} was bad! status: ${response.status}`.red,
        );
      } else {
        // unknown
        console.log(
          `${link} was unknown! status: ${response.status}`.gray,
        );
      }
    }

    const linkN = new URL(link).hostname;
    await dnsPromise(linkN);
    return isGood;
  } catch (err) {
    console.log(err);
  }
}

async function getTelescope() {
  fetch("http://localhost:3000/posts")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //console.log(data);
      // first empty file. This is so the file wont grow every time we run this
      fs.truncate("telescopeText.txt", 0, function () {
        for (i = 0; i < data.length; i++) {
          //console.log(data[i].url);
          fetch(`http://localhost:3000${data[i].url}`)
            .then((res) => {
              return res.json();
            })
            .then((webPageData) => {
              fs.appendFile(
                "telescopeText.txt",
                webPageData.html,
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                },
              );
            });
        }
      });
      populateLinkArr();
      makeCalls(linkArr)
        .then((data) => {
          if (data.every((result) => result === true)) {
            console.log(
              "exit with 0 for good - Note if using flag output of links may not be accurate",
            );
            process.exitCode = 0;
          } else {
            console.log(
              "exit with 1 for bad- Note if using flag output of links may not be accurate",
            );
            process.exitCode = 1;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
}
