<u>How to use/ setup</u>

- NOTE: YOU MUST HAVE NODE INSTALLED ON YOUR MACHINE FOR THIS TO WORK

1. Download the repository
2. Although the node_modules are in there run npm install to make sure everything is installed properly.
3. open terminal and go to OSD600-Release0.1\BrokenLinkChecker- Release 0.1 directory

<u>How to develop?</u>
If you find an issue, feel free to make one. If you wish to work on an issue feel free to fix it on another
branch and make a PR. I appreciate any contributions.

<u>How to format</u>
I have installed prettier via npm: npm install --save-dev --save-exact prettier
In order to have it effect your code run npx prettier --write fileName. I have added all the files to be ignored in .prettierignore

<u>How to us the linter</u>
I have installed ESLint via npm: npm install eslint
In order to have it effect your code npx eslint fileName I have added all the files to be ignored in
.eslintignore
For not there are only 2 rules, if you notice a rule I missed and should add feel free to make a issue or pr, thanks! :)
the processLink function 
<u>Editor/IDE Integration</u>
Make sure you have the prettier and ESLint installed (.vscode/entenssions.json should tell you). After that
when working on a file, after you press save prettier and ESLint will be applied to the file

<u>Tests/u>
To run tests go in OSD600-Release0.1/BrokenLinkChecker- Release 0.1/ and in the terminal run: npm run test
I set the code coveerage analysis to run with this command. Please keep related tests close togther. For example if I have a test that passes a valid link to the processLink function writer the test to pass the invalid link under or over it.
