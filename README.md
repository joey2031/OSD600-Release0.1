# OSD600-Release0.1

<u>Description of Tool</u>

- This is a command line tool that takes a file as input, reads and finds http:// and https:// links throughout the file and tells the user which ones are working and which ones are broken. Example usage: node lab1.js test.html
- The tool will output all of the links in different colours: red (broken), green (not broken) unknown (grey). You may also give the agrument v or version to check the current version of the tool. If the user enters no arguments a standard help/usage message showing how to run the tool, which command line arguments can be passed will be showen.

<u>Commands Available</u>

- node index.js v and node index.js version will print the current version of the tool.
- node index.js test.html (or a different file) Grabs all links and outputs them with a status code (colour coded).
- node index.js test.html --good Outputs only the links with status code of 200 (green), can also use --bad option to only output the broken links with a status code of 404 (red).
- node index.js --ignore ignore.txt test.txt Runs tool like normal but takes in another file with links to ignore, (dont process)
- node index.js --telescope check links on latest 10 posts on local telescope instance (http://localhost:3000/posts)

<u>installation</u>
This node package is to be ran from the command line with npx. In a node project first install npx via npm
(npm install npx). Then install this tool via npm (npm install jassal-link-checker). You can then run it
like: npx jassal-link-checker test.txt
