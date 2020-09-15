// Built in node functionality to get command line args
// Src: https://stackabuse.com/command-line-arguments-in-node-js/#:~:text=command()%20option%2C%20which%20helps,argv)%20%3D%3E%20%7B%20console. 

/*first index contains the path to our node executable, second index contains the path to the script file
rest of the indexes contain the arguments that we passed in their respective sequence.*/

let fs = require('fs');
let linesArr = [];
let linkArr = [];
//console.log(process.argv.length); 
if (process.argv.length < 3) { // will always be at least 2
    console.log("ERROR: Please enter command line argument (name of file to be processed).");
} else {

    // Each index in the array stores a line in the file
    linesArr = fs.readFileSync('test.html', 'utf8').split('\n');

    for (let i = 0; i < linesArr.length; i++) {
        console.log(linesArr[i]);
    }
    console.log(linesArr.length);

    // Now we need to see how to use RegEx
    console.log("Using regEx!");
    for (let i = 0; i < 4; i++) {
        console.log(linesArr.length);
        //console.log("Inside second loop");
        let link = new RegExp('/abc/').test(linesArr[i]);
        console.log(link);
    }

    // After this loop through array check each line for a url then put the url in another array
    // Then loop through URL array and make a request to each one, check status code.

}

/*
Will take out later -> Prints args
for (let j = 0; j < process.argv.length; j++) {
    console.log(j + ' -> ' + (process.argv[j]));
}
*/

