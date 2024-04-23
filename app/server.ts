// const http = require('http');

// const port = process.env.PORT || 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

const fs = require('fs');
let dictionary_words = []
let dictionary = {};

// Initialize dictionary with empty sets
for (let i = 20; i < 26; i++) {
  dictionary[String.fromCharCode(97 + i)] = new Set();
}

try {
  const data = fs.readFileSync('./assets/common_words.txt', 'utf8');
  dictionary_words = data.split('\r\n');
} catch (err) {
  console.error(err);
}

console.time("populateDictionary");

// Populate dictionary
for (let word of dictionary_words) {
  for (let letter of word) {
    if (dictionary[letter]) {
      dictionary[letter].add(word);
    }
  }
}


console.timeEnd("populateDictionary");

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

let uniqueCharacters = getUniqueCharacters("The quick brown fox jumps over the lazy dog.");
console.log(uniqueCharacters)

let newDictionary = {}

for (let alphabet of Object.keys(dictionary)) {
  console.log(alphabet, uniqueCharacters.includes(alphabet))
  if (uniqueCharacters.includes(alphabet)) {
    newDictionary[alphabet] = dictionary[alphabet]
  }
}

function processStrings(string1, string2) {
  // Concatenate the strings and split them into an array of characters
  const combinedChars = (string1 + string2).split('');

  // Remove duplicates by converting the array to a Set and back to an array
  const uniqueChars = [...new Set(combinedChars)];

  // Sort the array of unique characters in alphabetical order
  const sortedChars = uniqueChars.sort();

  // Join the sorted characters back into a single string
  const sortedString = sortedChars.join('');

  return sortedString;
}

function setIntersection(set1, set2) {
  const intersection = new Set();
  for (const item of set1) {
    if (set2.has(item)) {
      intersection.add(item);
    }
  }
  return intersection;
}

function generateIntersections(dictionary) {
  const intersections = {};

  // Iterate through each character in the dictionary
  const chars = Object.keys(dictionary);
  for (let i = 0; i < chars.length; i++) {
    for (let j = i + 1; j < chars.length; j++) {
      const char1 = chars[i];
      const char2 = chars[j];
      // Ensure char1 is lexically smaller than char2
      const key = processStrings(char1, char2);

      // Intersection of sets containing words for char1 and char2
      const intersection = setIntersection(dictionary[char1], dictionary[char2]);

      // If intersection is not empty, save it to intersections object
      if (intersection.size > 0) {
        intersections[key] = intersection;
      }
    }
  }

  return intersections;
}

// function generateIntersections(dictionary) {
//   const intersections = {};

//   // Create a map of words to characters
//   const wordToChars = {};
//   for (const char in dictionary) {
//     for (const word of dictionary[char]) {
//       if (!wordToChars[word]) {
//         wordToChars[word] = new Set();
//       }
//       wordToChars[word].add(char);
//     }
//   }

//   // Iterate through each character in the dictionary
//   const chars = Object.keys(dictionary);
//   for (let i = 0; i < chars.length; i++) {
//     for (let j = i + 1; j < chars.length; j++) {
//       const char1 = chars[i];
//       const char2 = chars[j];
//       // Ensure char1 is lexically smaller than char2
//       const key = processStrings(char1, char2);

//       // Intersection of sets containing words for char1 and char2
//       const intersection = new Set();
//       for (const word of dictionary[char1]) {
//         if (wordToChars[word].has(char2)) {
//           intersection.add(word);
//         }
//       }

//       // If intersection is not empty, save it to intersections object
//       if (intersection.size > 0) {
//         intersections[key] = intersection;
//       }
//     }
//   }

//   return intersections;
// }



function recursivelyGenerateIntersections(dictionary) {
  const finalResult = {}
  let order = 1;
  let intersection = generateIntersections(dictionary);
  finalResult[order] = intersection;

  while (Object.keys(intersection).length > 0) {
    order++;
    intersection = generateIntersections(intersection);
    if (Object.keys(intersection).length > 0) { finalResult[order] = intersection; }
  }
  return finalResult
}

function createUnionOfSets(dictionary) {
  const unionSet = new Set();

  // Iterate through each key in the dictionary
  for (const key in dictionary) {
    // Iterate through each string in the set of the current key
    for (const str of dictionary[key]) {
      // Add the string to the union set
      unionSet.add(str);
    }
  }

  return unionSet;
}

console.time("recursive");
const intersection = recursivelyGenerateIntersections(dictionary);

let usefulWords = []
for (let key in intersection[Object.keys(intersection).length]) {
  // i want to loop through a set of words and add only words shorter than 6 characters to the usefulWords array
  for (let word of intersection[Object.keys(intersection).length][key]) {
    usefulWords.push(word)
  }
}
for (let key in intersection[Object.keys(intersection).length -1]) {
  // i want to loop through a set of words and add only words shorter than 6 characters to the usefulWords array
  for (let word of intersection[Object.keys(intersection).length - 1][key]) {
    usefulWords.push(word)
  }
}


console.log(usefulWords)
console.timeEnd("recursive");
// console.log(recursivelyGenerateIntersections(dictionary))

const resultsOrders = Object.keys(intersection);

resultsOrders.forEach((order) => {
  console.log(`Order ${order}: ${Object.keys(intersection[order]).length} intersections`);

  for (let key in intersection[order]) {
    console.log(`    ${key}: ${intersection[order][key].size} words`);
  }
});
console.log(intersection[Object.keys(intersection).length])