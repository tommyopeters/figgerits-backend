const fs = require('fs');

const { Trie } = require('./TrieClass');


let common_words = [];
let dictionary = new Trie();

try {
    const data = fs.readFileSync('./assets/common_words.txt', 'utf8');
    common_words = data.split('\r\n');
} catch (err) {
    console.error(err);
}


console.time("populateDictionary");
common_words.forEach(word => {
    dictionary.insert(word.toLowerCase());
});
console.log(dictionary)
console.timeEnd("populateDictionary");

export { dictionary };