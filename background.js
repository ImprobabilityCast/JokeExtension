(function () {
var urls = ["*://*.youtube.com/watch?*", "*://*.youtube.com/embed/*"];
var ytJokeURLs = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // rick roll
    "https://www.youtube.com/watch?v=pwSsT8IU0WE", // crab rave
    "https://www.youtube.com/watch?v=QH2-TGUlwu4", // nyan cat
];

function isSubstringOfURL(urlArray, url) {
    let urlLen = urlArray[0].length;
    let test = url.substring(0, urlLen);

    for (let item of urlArray) {
        if (test === item) return true;
    }
    return false;
}

chrome.runtime.onInstalled.addListener(function () {
    console.log("loaded");
});

chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (isSubstringOfURL(ytJokeURLs, details.url)) {
        console.log("not redirecting");
        return {};
    } else {
        let idx = Math.floor(Math.random() * ytJokeURLs.length);
        console.log("redirecting to url #" + idx);
        return {redirectUrl: ytJokeURLs[idx]};
    }
},
{urls: urls},
["blocking"]);

})();