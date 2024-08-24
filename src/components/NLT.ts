const nlp = require('compromise');

export function getNounsAndVerbs(wordList) {
  const nounsAndVerbs = [];

  for (const word of wordList) {
    const doc = nlp(word);
    if (doc.nouns().length > 0 || doc.verbs().length > 0) {
      nounsAndVerbs.push(word);
    }
  }

  return nounsAndVerbs;
}