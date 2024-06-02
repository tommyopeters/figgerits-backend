const router = require("express").Router();
const QuoteModel = require("../models/quote.model");
// const { selectWords } = require("../utils/nlp");
// const {openai} = require("../config/openai");
// const { common_words } = require("../components/Dictionary");

// let valid_words = common_words.filter(word => word.length > 3 && word.length < 7);

// const quotes = [
//     {
//         "fact": "A cloud weighs around a million tonnes.",
//         "info": "A cloud typically has a volume of around 1km3 and a density of around 1.003kg per m3 – that's a density that’s around 0.4 per cent lower than the air surrounding it (this is how they are able to float)."
//     },

//     {
//         "fact": "Giraffes are 30 times more likely to get hit by lightning than people.",
//         "info": "True, there are only five well-documented fatal lightning strikes on giraffes between 1996 and 2010. But due to the population of the species being just 140,000 during this time, it makes for about 0.003 lightning deaths per thousand giraffes each year. This is 30 times the equivalent fatality rate for humans."
//     },

//     {
//         "fact": "Identical twins don’t have the same fingerprints.",
//         "info": "You can’t blame your crimes on your twin, after all. This is because environmental factors during development in the womb (umbilical cord length, position in the womb, and the rate of finger growth) impact your fingerprint."
//     },

//     {
//         "fact": "Earth’s rotation is changing speed.",
//         "info": "It's actually slowing. This means that, on average, the length of a day increases by around 1.8 seconds per century. 600 million years ago a day lasted just 21 hours."
//     },

//     {
//         "fact": "Your brain is constantly eating itself.",
//         "info": "This process is called phagocytosis, where cells envelop and consume smaller cells or molecules to remove them from the system. Don’t worry! Phagocytosis isn't harmful, but actually helps preserve your grey matter."
//     },

//     {
//         "fact": "The largest piece of fossilised dinosaur poo discovered is over 30cm long and over two litres in volume.",
//         "info": "Believed to be a Tyrannosaurus rex turd, the fossilised dung (also named a 'coprolite') is helping scientists better understand what the dinosaur ate."
//     },

//     {
//         "fact": "The Universe's average colour is called 'Cosmic latte'.",
//         "info": "In a 2002 study, astronomers found that the light coming from galaxies averaged into a beige colour that’s close to white."
//     },

//     {
//         "fact": "Animals can experience time differently from humans.",
//         "info": "To smaller animals, the world around them moves more slowly compared to humans. Salamanders and lizards, for example, experience time more slowly than cats and dogs. This is because the perception of time depends on how quickly the brain can process incoming information."
//     },

//     {
//         "fact": "Water might not be wet.",
//         "info": "This is because most scientists define wetness as a liquid’s ability to maintain contact with a solid surface, meaning that water itself is not wet, but can make other objects wet."
//     },

//     {
//         "fact": "A chicken once lived for 18 months without a head.",
//         "info": "Mike the chicken's incredible feat was recorded back in the 1940s in the USA. He survived as his jugular vein and most of his brainstem were left mostly intact, ensuring just enough brain function remained for survival. In the majority of cases, a headless chicken dies in a matter of minutes."
//     },

//     {
//         "fact": "All the world’s bacteria stacked on top of each other would stretch for 10 billion light-years.",
//         "info": "Together, Earth's 0.001mm-long microbes could wrap around the Milky Way over 20,000 times."
//     },

//     {
//         "fact": "Wearing a tie can reduce blood flow to the brain by 7.5 per cent.",
//         "info": "A study in 2018 found that wearing a necktie can reduce the blood flow to your brain by up to 7.5 per cent, which can make you feel dizzy, nauseous, and cause headaches. They can also increase the pressure in your eyes if on too tight and are great at carrying germs."
//     },

//     {
//         "fact": "The fear of long words is called Hippopotomonstrosesquippedaliophobia.",
//         "info": "The 36-letter word was first used by the Roman poet Horace in the first century BCE to criticise those writers with an unreasonable penchant for long words. It was American poet Aimee Nezheukumatathil, possibly afraid of their own surname, who coined the term how we know it in 2000."
//     },

//     {
//         "fact": "The world’s oldest dog lived to 29.5 years old.",
//         "info": "While the median age a dog reaches tends to be about 10-15 years, one Australian cattle dog, ‘Bluey’, survived to the ripe old age of 29.5."
//     },

// ]

// // select a random quote
// let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

// // get unique characters from the quote
// let uniqueCharacters = getUniqueCharacters(randomQuote.fact);

// // get unique words from the quote
// let uniqueWords = getUniqueWords(randomQuote.fact);

// // remove uniqueWords from common_words
// valid_words = valid_words.filter(word => !uniqueWords.includes(word));

// // select words that contain the unique characters
// let selectedWords = selectWords(valid_words, uniqueCharacters);


const { selectWords, excludeWordsWithoutCharacters } = require("../utils/nlp");
const { replicate } = require("../config/openai");
const { common_words } = require("../components/Dictionary");
const { getUniqueCharacters, getUniqueWords } = require("../utils/nlp");

const generateHints = async (words) => {
    // Define the prompt for the LLM
    const Prompt = `Generate a valid JSON string representing an array of objects from the given words: [${words.join(', ')}]. Each object should have two properties: 'word' and 'hint'. The 'word' property should hold the word itself, and the 'hint' property should contain a cryptic hint for the word, limited to 6 words.`;

    const model = "andreasjansson/llama-2-13b-chat-gguf:ddf8f2edd187159adba2266bc1eaa7f3e55af483f23c1b3618c28ec73a9370bd";
    const input = {
        system_prompt: "Generate a valid JSON string representing an array of objects from a given list of words. Each object should have two properties: 'word' and 'hint'. The 'word' property should be the word itself, and the 'hint' property should be a cryptic hint for the word, not exceeding 6 words. The output should not contain any additional text.",
        prompt: Prompt,
    };
    const output = await replicate.run(model, { input });
    return output.join('');
}

function convertToValidJson(invalidJson) {
    const jsonString = JSON.stringify(invalidJson);
    const validJsonString = jsonString.replace(/"(\w+)"\s*:/g, function (_, key) {
        return `"${key}":`;
    });
    return JSON.parse(validJsonString);
}


let valid_words = common_words.filter(word => word.length > 3 && word.length < 7);

const quotes = [
    {
        "fact": "A cloud weighs around a million tonnes.",
        "info": "A cloud typically has a volume of around 1km3 and a density of around 1.003kg per m3 – that's a density that’s around 0.4 per cent lower than the air surrounding it (this is how they are able to float)."
    },

    {
        "fact": "Giraffes are 30 times more likely to get hit by lightning than people.",
        "info": "True, there are only five well-documented fatal lightning strikes on giraffes between 1996 and 2010. But due to the population of the species being just 140,000 during this time, it makes for about 0.003 lightning deaths per thousand giraffes each year. This is 30 times the equivalent fatality rate for humans."
    },

    {
        "fact": "Identical twins don’t have the same fingerprints.",
        "info": "You can’t blame your crimes on your twin, after all. This is because environmental factors during development in the womb (umbilical cord length, position in the womb, and the rate of finger growth) impact your fingerprint."
    },

    {
        "fact": "Earth’s rotation is changing speed.",
        "info": "It's actually slowing. This means that, on average, the length of a day increases by around 1.8 seconds per century. 600 million years ago a day lasted just 21 hours."
    },

    {
        "fact": "Your brain is constantly eating itself.",
        "info": "This process is called phagocytosis, where cells envelop and consume smaller cells or molecules to remove them from the system. Don’t worry! Phagocytosis isn't harmful, but actually helps preserve your grey matter."
    },

    {
        "fact": "The largest piece of fossilised dinosaur poo discovered is over 30cm long and over two litres in volume.",
        "info": "Believed to be a Tyrannosaurus rex turd, the fossilised dung (also named a 'coprolite') is helping scientists better understand what the dinosaur ate."
    },

    {
        "fact": "The Universe's average colour is called 'Cosmic latte'.",
        "info": "In a 2002 study, astronomers found that the light coming from galaxies averaged into a beige colour that’s close to white."
    },

    {
        "fact": "Animals can experience time differently from humans.",
        "info": "To smaller animals, the world around them moves more slowly compared to humans. Salamanders and lizards, for example, experience time more slowly than cats and dogs. This is because the perception of time depends on how quickly the brain can process incoming information."
    },

    {
        "fact": "Water might not be wet.",
        "info": "This is because most scientists define wetness as a liquid’s ability to maintain contact with a solid surface, meaning that water itself is not wet, but can make other objects wet."
    },

    {
        "fact": "A chicken once lived for 18 months without a head.",
        "info": "Mike the chicken's incredible feat was recorded back in the 1940s in the USA. He survived as his jugular vein and most of his brainstem were left mostly intact, ensuring just enough brain function remained for survival. In the majority of cases, a headless chicken dies in a matter of minutes."
    },

    {
        "fact": "All the world’s bacteria stacked on top of each other would stretch for 10 billion light-years.",
        "info": "Together, Earth's 0.001mm-long microbes could wrap around the Milky Way over 20,000 times."
    },

    {
        "fact": "Wearing a tie can reduce blood flow to the brain by 7.5 per cent.",
        "info": "A study in 2018 found that wearing a necktie can reduce the blood flow to your brain by up to 7.5 per cent, which can make you feel dizzy, nauseous, and cause headaches. They can also increase the pressure in your eyes if on too tight and are great at carrying germs."
    },

    {
        "fact": "The fear of long words is called Hippopotomonstrosesquippedaliophobia.",
        "info": "The 36-letter word was first used by the Roman poet Horace in the first century BCE to criticise those writers with an unreasonable penchant for long words. It was American poet Aimee Nezheukumatathil, possibly afraid of their own surname, who coined the term how we know it in 2000."
    },

    {
        "fact": "The world’s oldest dog lived to 29.5 years old.",
        "info": "While the median age a dog reaches tends to be about 10-15 years, one Australian cattle dog, ‘Bluey’, survived to the ripe old age of 29.5."
    },

]

const extractArray = (string) => {
    let start = string.indexOf('[');
    let end = string.indexOf(']');

    try {
        let data = JSON.parse(string.substring(start, end + 1).split('\n').join(''));
        return data;
        // Continue processing the data
    } catch (error) {
        console.error("Invalid JSON format: ", string.substring(start, end + 1));
        return string;
        // Handle the error as needed
    }
}



// router.post("/api/quotes", (req, res) => {

//     // select a random quote
//     let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

//     // get unique characters from the quote
//     (async () => {
//         let uniqueCharacters = getUniqueCharacters(randomQuote.fact);

//         // get unique words from the quote
//         let uniqueWords = getUniqueWords(randomQuote.fact);

//         // remove uniqueWords from common_words
//         valid_words = excludeWordsWithoutCharacters(valid_words).filter(word => !uniqueWords.includes(word));

//         // select words that contain the unique characters
//         let selectedWords = selectWords(valid_words, uniqueCharacters);

//         const answer = await (generateHints(selectedWords));

//         res.send({
//             fact: randomQuote.fact,
//             info: randomQuote.info,
//             hints: extractArray(answer)
//         });
//     })();
// });
router.post("/api/quotes", async (req, res) => {

    try {
        if (req.body.quote) {
            let uniqueCharacters = getUniqueCharacters(req.body.quote);
            let uniqueWords = getUniqueWords(req.body.quote);
            let filteredWords = common_words.filter(word => word.length > 3 && word.length < 7).filter(word => !uniqueWords.includes(word));
            let valid_words = excludeWordsWithoutCharacters(filteredWords, uniqueCharacters);
            let selectedWords = selectWords(valid_words, uniqueCharacters);
            const answer = await (generateHints(selectedWords));
            const quote = await QuoteModel.create({
                quote: req.body.quote,
                info: req.body.info,
                hints: extractArray(answer),
            });
            res.status(200).json(quote);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while creating the quote." });
    }
});

module.exports = router;