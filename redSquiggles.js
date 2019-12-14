(function () {

const PROBABILITY_NODE = 1.00;
const PROBABILITY_WORD = 0.05;
const ALPHABET = "qwertyuiopasdfghjklzxcvbnm";
const ALPHABET_CAPS = "QWERTYUIOPASDFGHJKLZXCVBNM";

function replaceIndex(str, idx, rep) {
    return str.substring(0, idx) + rep + str.substring(idx + 1);
}

function randomSwap(word) {
    let idx = Math.floor(Math.random() * word.length);
    // 0x7A = 'z', 0x61 = 'a'
    let rand = ALPHABET[Math.floor(ALPHABET.length * Math.random())];
    return replaceIndex(word, idx, rand);
}

function randomSimilarLetters(word) {
    let b = word.indexOf("b");
    let d = word.indexOf("d");
    let m = word.indexOf("m");
    let n = word.indexOf("n");
    let i = word.indexOf("i");

    if (b !== -1) {
        return replaceIndex(word, b, "d");
    } else if (d !== -1) {
        return replaceIndex(word, d, "b");
    } else if (m !== -1) {
        return replaceIndex(word, m, "n");
    } else if (n !== -1) {
        return replaceIndex(word, n, "m");
    } else if (i !== -1) {
        return replaceIndex(word, i, "l");
    } else {
        return word;
    }
}

function randomCapitals(word) {
    let idx = Math.floor(Math.random() * word.length);
    let letterPos = ALPHABET.indexOf(word.charAt(idx));
    if (letterPos !== -1) {
        return replaceIndex(word, idx, ALPHABET_CAPS.charAt(letterPos));
    } else {
        return word;
    }
}

function invertCapitials(word) {
    let arr = [];
    for (let i = 0; i < word.length; i++) {
        let idx = ALPHABET.indexOf(word.charAt(i));
        if (idx === -1) {
            idx = ALPHABET_CAPS.indexOf(word.charAt(i));
            if (idx !== -1) {
                arr[i] = ALPHABET.charAt(idx);
            } else {
                arr[i] = word.charAt(i);
            }
        } else {
            arr[i] = ALPHABET_CAPS.charAt(idx);
        }
    }
    return arr.join("");
}

/* word cannot be a 0-length string */
function randomTypo(word) {
    if (ALPHABET_CAPS.indexOf(word.charAt(0)) !== -1 && Math.random() < 0.5) {
        var ret = invertCapitials(word);
    } else {
        var ret = randomSimilarLetters(word);
        if (ret === word || Math.random() < 0.5) {
            ret = randomCapitals(word);
            if (ret === word || Math.random() < 0.5) {
                ret = randomSwap(word);
            }
        }
    }
    // TODO: make this run on all domains
    return ret;
}

function makeWord(newWords, oldWord) {
    let text = " ";
    let count = 0;
    if (Math.random() < PROBABILITY_WORD) {
        let span = document.createElement("span");
        span.style.textDecoration = "red wavy underline";
        span.innerText = randomTypo(oldWord);
        newWords.push(span);
        count = 1;
    } else {
        text = " " + oldWord + " ";
    }
    newWords.push(document.createTextNode(text));
    return count;
}

function createNewChild(children) {
    let span = document.createElement("span");
    for (child of children) {
        span.appendChild(child);
    }
    return span;
}

function makeTypos(root) {
    var wordCount = 0;
    for (node of root.childNodes) {
        if (node.nodeType === document.TEXT_NODE) {
            let trimmed = node.nodeValue.trim();
            if (trimmed.length > 0 && Math.random() < PROBABILITY_NODE) {
                let words = trimmed.split(/\s/);
                let newWords = [];
                for (let j = 0; j < words.length; j++) {
                    wordCount += makeWord(newWords, words[j]);
                }
                root.replaceChild(createNewChild(newWords), node);
            }
        } else if (node.childNodes.length > 0) {
            wordCount += makeTypos(node);
        }
    }
    return wordCount;
}

console.log("created " + makeTypos(document.body) + " typos.");

})();
