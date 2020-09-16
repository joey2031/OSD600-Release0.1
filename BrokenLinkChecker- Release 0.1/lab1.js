// Built in node functionality to get command line args
// Src: https://stackabuse.com/command-line-arguments-in-node-js/#:~:text=command()%20option%2C%20which%20helps,argv)%20%3D%3E%20%7B%20console. 

// RegRx useful source: https://blog.bitsrc.io/a-beginners-guide-to-regular-expressions-regex-in-javascript-9c58feb27eb4

/*first index contains the path to our node executable, second index contains the path to the script file
rest of the indexes contain the arguments that we passed in their respective sequence.*/

let fs = require('fs');
let linesArr = [];
let linkArr = [];
let regEx = /abc/ // so now I need to find a regEx for links??
// need to add escape characters
//let regEx = https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)

// Stack Overflow: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
// might be this (original): https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
// However they did not escape the end.
// https://regexr.com/37i6s

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
        var result = regEx.exec(linesArr[i]); // store the match. **Create and populate variable**
        linkArr.push(result[0]); // push into array 
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

