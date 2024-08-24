// // const { openai } = require('./config/openai');
// const { dictionary } = require('./components/Dictionary');
// const { getNounsAndVerbs } = require('./components/NLT');
// const { recursivelyGenerateIntersections, createUnionOfSets } = require('./utils/intersections');
// // const { dfs, getUniqueCharacters, getUniqueWords } = require('./utils/nlp');

// // let words = [];

// // let quote = "Your brain is constantly eating itself";


// let uniqueCharacters = getUniqueCharacters(quote);
// let uniqueWords = getUniqueWords(quote);

// console.time("findWords");
// dfs(dictionary.root, '', words, uniqueCharacters);
// console.timeEnd("findWords");

// let nounsAndVerbs = getNounsAndVerbs(words)
// // console.log(nounsAndVerbs)

// let finalWordsPerCharacter = {}
// for (let char of uniqueCharacters) {
//     // finalWordsPerCharacter[char] = words.filter(word => word.includes(char));
//     // create a Set of words that contain the character
//     finalWordsPerCharacter[char] = new Set(words.filter(word => word.includes(char) && word.length > 3 && word.length < 6 ));

// }
// console.log(finalWordsPerCharacter)


// console.time("recursive");
// const intersection = recursivelyGenerateIntersections(finalWordsPerCharacter);

// const resultsOrders = Object.keys(intersection);

// // resultsOrders.forEach((order) => {
// //     console.log(`Order ${order}: ${Object.keys(intersection[order]).length} intersections`);

// //     for (let key in intersection[order]) {
// //         console.log(`    ${key}: ${intersection[order][key].size} words`);
// //     }
// // });

// console.timeEnd("recursive");

// console.log(Array.from(createUnionOfSets(intersection[resultsOrders[resultsOrders.length - 1]])).join(', '))
// // convert the union set to an array


// // //for eacg character in finalWordsPerCharacter, get a random word from the array
// // let finalWords = []
// // for (let char in finalWordsPerCharacter) {
// //     //check if the character exists in any of the words in finalWords array
// //     let word = finalWordsPerCharacter[char].filter(wrd => !finalWords.includes(wrd));
// //     console.log(word)
// //     if (word.length < 0) {
// //         word = finalWordsPerCharacter[char][Math.floor(Math.random() * finalWordsPerCharacter[char].length)];
// //         finalWords.push(word);
// //     } else {
// //         finalWords.push(word[Math.floor(Math.random() * word.length)])
// //     }
// // }
// // console.log(finalWords.join(', '))

// console.log(uniqueCharacters.join(', '))
// // console.log(words.filter(word => !nounsAndVerbs.includes(word)))

// // let finalWords = words.filter(word => !uniqueWords.includes(word) && word.length > 2 && word.length < 10);
// // // console.log(finalWords);
// // // console.log(uniqueWords);
// // console.log(finalWords.join(', '))

// // // openai.createChatCompletion({
// // //     model: 'gpt-3.5-turbo',
// // //     messages: [
// // //         { role: 'system', content: "You are a helpful puzzler's assistant. You will receive a " },
// // //         { role: 'user', content: 'What is the meaning of life?' },
// // //     ],
// // // }).then(response => {
// // //     console.log(response.data.choices[0].message.content);
// // //     console.log(response.data)
// // // }).catch(error => {
// // //     console.error(error);
// // // });