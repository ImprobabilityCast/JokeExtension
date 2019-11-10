(function () {
var urls = ["*://*.youtube.com/watch?*", "*://*.youtube.com/embed/*"];
var ytJokeURLs = [
    "dQw4w9WgXcQ", // rick roll
    "pwSsT8IU0WE", // crab rave
    "QH2-TGUlwu4", // nyan cat
];

function replaceID(url, newID) {
    let findStr = "/watch?v=";
    let idx = url.indexOf(findStr);
    if (idx == -1) { // embedded yt videos
        idx = url.lastIndexOf("/");
        return url.substring(0, idx + 1)
            + newID + url.substring(idx + 1 + newID.length);
    } else {
        return url.substring(0, idx + findStr.length)
            + newID + url.substring(idx + findStr.length + newID.length);
    }
}

function isSubstringOfURL(urlArray, url) {
    let urlLen = urlArray[0].length;
    let test = url.substring(0, urlLen);
    let idx = url.indexOf("/watch?");
    if (idx == -1) {
        idx = url.lastIndexOf("/");
        url = url.substring(idx + 1, urlLen);
    } else {
        url = url.substring(idx + "/watch?".length, urlLen);
    }

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
        let newURL = replaceID(details.url, ytJokeURLs[idx]);
        console.log("redirecting to url: " + newURL);
        return {redirectUrl: newURL};
    }
},
{urls: urls},
["blocking"]);

})();