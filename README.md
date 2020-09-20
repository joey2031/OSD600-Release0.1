# OSD600-Release0.1

<u>Updates</u>
<u>Description of Tool</u>
This is a command line tool that takes a file as input, reads and finds http:// and https:// links throughout the file and tells the user which ones are working and which ones are broken. Example usage: node lab1.js test.html
The tool will output all of the links in different colours: red (broken), green (not broken) unknown (grey). You may also give the agrument v or version to check the current version of the tool. If the user enters no arguments a standard help/usage message showing how to run the tool, which command line arguments can be passed will be showen. 

<u>Updates</u>
- Update 1: I noticed I was making things harder then they need to be. Instead of using the readLine api I used fs.readFileSync. Now I need to see how RegEx works in Javascript. [Sept 15 2020 12:32 PM]
- Update 2: Played around with RegEx in Javascript, have a understanding on how it works, for now this reads the fine line by line, matches abc and stores every match in a array. Next I need to see how to make a RegEx to match URLs using the http:// and https:// schemes. That way I can then go through the array and test each URL to see if its broken. I put some Stack Overflow references I will look at later on [Sept 15 2020 8:08 PM]
- Update 3: Got the regular expression to find links in a file and store them in an array. The next step is to go through this array and test every link to see if it works or not. I also added a folder with a PDF of a article I found that shows useful Regular Expressions I may use one day. I like to keep useful atricles and code snippits since it makes the work eaiser in the future. [Sept 16 2020 12:23 PM]
- Update 4: ain functionality of program now works! Successfuly checks every http:// and https:// links in the file to see if its broken or not. I already added one of the additional features: colourize your output. Good URLs should be printed in green, bad URLs in red, and unknown URLs in gray. I need to add one more additional feature and I am done!
- Update 5: [Sept 16 2020 7:54 PM] Added second additional feature running the tool with the v or version argument should print the name of the tool and its version. When there are multpile links on one line it is still a bit buggy. Other then that there is nothing else I need to fix!  [Sept 16 2020 2:27 PM]

