// Built in node functionality to get command line args
// Src: https://stackabuse.com/command-line-arguments-in-node-js/#:~:text=command()%20option%2C%20which%20helps,argv)%20%3D%3E%20%7B%20console. 
// src for readline: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/


/*first index contains the path to our node executable, second index contains the path to the script file
rest of the indexes contain the arguments that we passed in their respective sequence.*/

let fs = require('fs');
const readline = require('readline');
let linesArr = [];
let linkArr = [];
//console.log(process.argv.length); 
if (process.argv.length < 3) { // will always be at least 2
    console.log("ERROR: Please enter command line argument (name of file to be processed).");
} else {
    // create the object that will read from the stream using createInterface() function
    // had this but I took is out -> output: process.stdout
    const readInterface = readline.createInterface({
        // maybe later add code to trap an arror if the file does not exist
        input: fs.createReadStream(process.argv[2]),
        console: false
    });
    // whenever the line event occurs in the readInterface it should call our function and pass it the content read from the stream.
    readInterface.on('line', function (line) {
        console.log("pushing in array...")
        linesArr.push(line); // push each line into array
    });

    console.log(linesArr.length);

    // The array is still 0 so this wont work. So we might need a promise function
    for (let i = 0; i < linesArr.length; i++) {
        console.log("Inside the first loop");
        console.log(linesArr[i]);
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






//console.log("Using regEx!");
//for(let i = 0; i < 4; i++){
   // console.log(linesArr.length);
    //console.log("Inside second loop");
    //let link = new RegExp('/abc/').test(linesArr[i]);
    //console.log(link);
  //}
