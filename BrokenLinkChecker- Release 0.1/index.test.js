// npm run test
const nock = require("nock");
const { makeCalls, processLink, fn } = require("./index.js");

let linkArr = ["https://www.youtube.com/", "https://www.google.com/", "https://www.facebook.com"];
let invalidLinkArr = ["https://www.youtube.com/", "https://www.google.com/slkdll", "https://www.facebook.com"];
let mixedLinkArr = ["https://www.youtube.com/", "https://www.google.com/slkdll", "https://www.facebook.com"];

const fetch = require("node-fetch");
// Step 1- Pick and set up a testing framework -> Jest
// Step 2

test("Pass array of valid links to makeCalls", async () => {
    const result = await makeCalls(linkArr);
    expect(result).toEqual([true, true, true]);
});
test("Pass array with some invalid links to makeCalls", async () => {
    const result = await makeCalls(invalidLinkArr);
    expect(result).not.toEqual([true, true, true]);
});
test("Pass array with some invalid links and some valid links to makeCalls", async () => {
    const result = await makeCalls(invalidLinkArr);
    expect(result).toEqual([true, false, true]);
});

//For some reason, null, emptyArray, or undefined might be given
//In that case, that should return some error
test("Pass array with undefined, empty array and null to makeCalls should return empty array", async () => {
    [undefined, null, []].forEach(async (test) => {
      const result = await makeCalls(test);
      expect(result).toEqual([]);
    });
});
  
// step 3
test("Pass valid link (status 200) to processLink", async () => {
    const host = "https://www.youtube.com";
    const path = "/";
    nock(host).head(path).reply(200);
    const url = `${host}${path}`;
    const result = await processLink(url);
    expect(result).toBe(true);
});
test("Pass invalid link (status 404) to processLink", async () => {
    const host = "https://www.google.com/slkdll";
    const path = "/";
    nock(host).head(path).reply(404);
    const url = `${host}${path}`;
    const result = await processLink(url);
    expect(result).toBe(false);
});
// Step 4 Add Code Coverage Analysis
