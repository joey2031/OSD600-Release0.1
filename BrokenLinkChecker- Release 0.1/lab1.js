// Built in node functionality to get command line args. Src: https://stackabuse.com/command-line-arguments-in-node-js/#:~:text=command()%20option%2C%20which%20helps,argv)%20%3D%3E%20%7B%20console. 
// RegEx checker with regEx for http and https links: https://www.regexpal.com/?fam=104034
// Top 15 Commonly Used Regex: https://digitalfortress.tech/tricks/top-15-commonly-used-regex/


/*first index contains the path to our node executable, second index contains the path to the script file
rest of the indexes contain the arguments that we passed in their respective sequence.*/

let fs = require('fs');
let linesArr = [];
let linkArr = [];
let regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#()?&//=]*)/igm



console.log(process.argv.length); 
if (process.argv.length < 3) { // will always be at least 2
    console.log("ERROR: Please enter command line argument (name of file to be processed).");
} else {

    // Each index in the array stores a line in the file
    linesArr = fs.readFileSync(process.argv[2], 'utf8').split('\n');

    for (let i = 0; i < linesArr.length; i++) {
        console.log(linesArr[i]);
    }

    for (let i = 0; i < linesArr.length; i++) {
       if(regEx.test(linesArr[i])){ // if its true (match has been found)
        //console.log("The link found is " + linesArr[i]);
         // console.log(regEx.exec(linesArr[i])); -> null for some reason-> This did not work, had to use match instead

        var result = linesArr[i].match(regEx); // store the match. **Create and populate variable**
        linkArr.push(result); // push into array 
       }
    }
    
    console.log("Going to print linkArr!");
    for (let i = 0; i < linkArr.length; i++) {
        console.log(linkArr[i]);
    }
}


/*
Src: https://blog.bitsrc.io/a-beginners-guide-to-regular-expressions-regex-in-javascript-9c58feb27eb4
2 ways to make a regular expression in Javascript.
var regexConst = new RegExp('abc');
var regexLiteral = /abc/;

*/




/*
Will take out later -> Prints args
for (let j = 0; j < process.argv.length; j++) {
    console.log(j + ' -> ' + (process.argv[j]));
}
*/

