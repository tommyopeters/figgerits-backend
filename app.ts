//import trieclass
import { Trie } from './TrieClass';

const fs = require('fs');

let common_words = []
try {
    const data = fs.readFileSync('./assets/common_words.txt', 'utf8');
    common_words = data.split('\r\n');
} catch (err) {
    console.error(err);
}

let dictionary = new Trie();

console.time("populateDictionary");
common_words.forEach(word => {
    dictionary.insert(word.toLowerCase());
});
console.log(dictionary)
console.timeEnd("populateDictionary");

//implement a dfs function to find all possible words using a limited set of characters
const dfs = (node, word, words, characters) => {
    if (node.end) {
        words.push(word);
    }
    for (let char of characters) {
        if (node.children[char]) {
            dfs(node.children[char], word + char, words, characters);
        }
    }
}

let words = [];
let characters = ['a', 'b', 'c', 'd']; // replace with your characters

const getUniqueCharacters = (quote: string): string[] => {
    const uniqueCharacters: string[] = [];
    const characters: string[] = quote.toLowerCase().match(/[a-z]/g) || [];

    for (const char of characters) {
      if (!uniqueCharacters.includes(char)) {
        uniqueCharacters.push(char);
      }
    }

    return uniqueCharacters;
  };

  let uniqueCharacters = getUniqueCharacters("hello world");
console.time("findWords");
dfs(dictionary.root, '', words, uniqueCharacters);
console.timeEnd("findWords");

console.log(words);