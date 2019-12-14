(function () {

const PROBABILITY_NODE = 0.4;
const PROBABILITY_WORD = 0.10;
const ALPHABET = "qwertyuiopasdfghjklzxcvbnm";

function randomSwap(word) {
    let idx = Math.floor(Math.random() * word.length);
    // 0x7A = 'z', 0x61 = 'a'
    let rand_ch = ALPHABET[Math.floor(ALPHABET.length * Math.random())];
    return word.substring(0, idx) + rand_ch + word.substring(idx + 1);
}

function randomTypo(word) {
    // TODO: other typos & make this run on all domains
    return randomSwap(word);
}

function makeWord(newWords, oldWord) {
    let text = " ";
    if (Math.random() < PROBABILITY_WORD) {
        let span = document.createElement("span");
        span.style.textDecoration = "red wavy underline";
        span.innerText = randomTypo(oldWord);
        newWords.push(span);
    } else {
        text = " " + oldWord + " ";
    }
    newWords.push(document.createTextNode(text));
}

function createNewChild(children) {
    let span = document.createElement("span");
    for (child of children) {
        span.appendChild(child);
    }
    return span;
}

function makeTypos(root) {
    for (node of root.childNodes) {
        if (node.nodeType === document.TEXT_NODE) {
            let trimmed = node.nodeValue.trim();
            if (trimmed.length > 0 && Math.random() < PROBABILITY_NODE) {
                let words = trimmed.split(/\s/);
                let newWords = [];
                for (let j = 0; j < words.length; j++) {
                    makeWord(newWords, words[j]);
                }
                root.replaceChild(createNewChild(newWords), node);
            }
        } else if (node.childNodes.length > 0) {
            makeTypos(node);
        }
    }
}

makeTypos(document.body);

})()
