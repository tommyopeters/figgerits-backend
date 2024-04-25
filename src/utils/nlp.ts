export const dfs = (node, word, words, characters) => {
    if (node.end) {
        words.push(word);
    }
    for (let char of characters) {
        if (node.children[char]) {
            dfs(node.children[char], word + char, words, characters);
        }
    }
}

export const getUniqueCharacters = (quote: string): string[] => {
    const uniqueCharacters: string[] = [];
    const characters: string[] = quote.toLowerCase().match(/[a-z]/g) || [];

    for (const char of characters) {
        if (!uniqueCharacters.includes(char)) {
            uniqueCharacters.push(char);
        }
    }

    return uniqueCharacters;
};


export const getUniqueWords = (quote: string): string[] => {
    const uniqueWords: string[] = [];
    const words: string[] = quote.toLowerCase().match(/[a-z]+/g) || [];

    for (const word of words) {
        if (!uniqueWords.includes(word)) {
            uniqueWords.push(word);
        }
    }

    return uniqueWords;
}


export function removeSecondaryFromPrimary(primary, secondary) {
    return new Set([...primary].filter(alphabet => !secondary.has(alphabet)));
}

export function selectWords(words, alphabets) {
    let remainingAlphabets = new Set(alphabets);
    let chosenWords = [];

    while (remainingAlphabets.size > 0) {
        words.sort((a, b) => {
            let countA = Array.from(a).filter(alphabet => remainingAlphabets.has(alphabet)).length;
            let countB = Array.from(b).filter(alphabet => remainingAlphabets.has(alphabet)).length;
            return countB - countA;
        });
        let chosenWord = words.shift();
        chosenWords.push(chosenWord);

        let wordAlphabets = new Set(chosenWord);
        remainingAlphabets = removeSecondaryFromPrimary(remainingAlphabets, wordAlphabets);
    }

    return chosenWords;
}