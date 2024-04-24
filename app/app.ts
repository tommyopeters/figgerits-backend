// const { openai } = require('./components/OpenAi');
const {dictionary} = require('./components/Dictionary');

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

let quote = "Your brain is constantly eating itself";

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

const getUniqueWords = (quote: string): string[] => {
    const uniqueWords: string[] = [];
    const words: string[] = quote.toLowerCase().match(/[a-z]+/g) || [];

    for (const word of words) {
        if (!uniqueWords.includes(word)) {
            uniqueWords.push(word);
        }
    }

    return uniqueWords;
}

let uniqueCharacters = getUniqueCharacters(quote);
let uniqueWords = getUniqueWords(quote);

console.time("findWords");
dfs(dictionary.root, '', words, uniqueCharacters);
console.timeEnd("findWords");

let finalWords = words.filter(word => !uniqueWords.includes(word) && word.length > 2 && word.length < 10);
// console.log(finalWords);
// console.log(uniqueWords);
console.log(finalWords.join(', '))

// openai.createChatCompletion({
//     model: 'gpt-3.5-turbo',
//     messages: [
//         { role: 'system', content: "You are a helpful puzzler's assistant. You will receive a " },
//         { role: 'user', content: 'What is the meaning of life?' },
//     ],
// }).then(response => {
//     console.log(response.data.choices[0].message.content);
//     console.log(response.data)
// }).catch(error => {
//     console.error(error);
// });