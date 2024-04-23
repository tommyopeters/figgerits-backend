const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');

const { Trie } = require('./components/TrieClass');

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//import trieclass


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


openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'What is the meaning of life?' },
    ],
}).then(response => {
    console.log(response.data.choices[0].message.content);
    console.log(response.data)
}).catch(error => {
    console.error(error);
});