const { common_words } = require('./components/Dictionary');
const { dfs, getUniqueCharacters, getUniqueWords } = require('./utils/nlp');
let words = [];
let dictionary = common_words.filter(word => word.length > 3 && word.length < 6);

let quote = "The lazy dog jumped over the quick brown fox";

function greedyAlgorithm(words, alphabets) {
    const result = [];
    const alphabetCount = {};

    // Count the occurrence of each alphabet
    for (const word of words) {
        for (const alphabet of word) {
            alphabetCount[alphabet] = (alphabetCount[alphabet] || 0) + 1;
        }
    }

    // Sort the words by the number of unique alphabets they contain
    words.sort((a, b) => {
        const countA = Array.from(a).filter(alphabet => !alphabets.has(alphabet)).length;
        const countB = Array.from(b).filter(alphabet => !alphabets.has(alphabet)).length;
        return countB - countA;
    });

    // Greedily select words that cover the most uncovered alphabets
    for (const word of words) {
        if (result.length === alphabets.size) break; // All alphabets are covered
        const newAlphabets = Array.from(word).filter(alphabet => !alphabets.has(alphabet));
        if (newAlphabets.length > 0) {
            result.push(word);
            for (const alphabet of newAlphabets) {
                alphabets.add(alphabet);
            }
        }
    }

    return result;
}
function findWords(words, alphabets, target) {
    let remainingAlphabets = new Set(alphabets);
    let chosenWords = [];


    words.sort((a, b) => {
        let countA = Array.from(a).filter(alphabet => remainingAlphabets.has(alphabet)).length;
        let countB = Array.from(b).filter(alphabet => remainingAlphabets.has(alphabet)).length;
        return countB - countA;
    });
    for (let word of words) {
        if (chosenWords.length >= target) break;
        let wordAlphabets = new Set(word);
        if (Array.from(wordAlphabets).some(alphabet => remainingAlphabets.has(alphabet))) {
            chosenWords.push(word);
            wordAlphabets.forEach(alphabet => remainingAlphabets.delete(alphabet));
        }
    }

    return chosenWords;
}

function findMissingCharacters(words: string[], characters: string[]): string[] {
    let characterSet = new Set(characters);
    for (let word of words) {
        for (let char of word) {
            characterSet.delete(char);
        }
    }
    return Array.from(characterSet);
}


const uniqueChars = getUniqueCharacters(quote)

words = selectWords(dictionary, uniqueChars)
console.log(words);

const remainingAlphabets = findMissingCharacters(words, uniqueChars);
console.log(remainingAlphabets);

// let finalWords = findWords(common_words, remainingAlphabets, 1);
// console.log(finalWords);

// console.log(findMissingCharacters(finalWords.concat(words), uniqueChars));