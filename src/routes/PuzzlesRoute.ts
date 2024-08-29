const router = require("express").Router();
const PuzzleModel = require("../models/puzzle.model");
const UserModel = require("../models/user.model");

const { selectWords, excludeWordsWithoutCharacters } = require("../utils/nlp");
const { replicate } = require("../config/openai");
const { common_words } = require("../components/Dictionary");
const { getUniqueCharacters, getUniqueWords } = require("../utils/nlp");

const generateHints = async (words) => {
    // Define the prompt for the LLM
    const Prompt = `Generate a valid JSON string representing an array of objects from the given words: [${words.join(', ')}]. Each object should have two properties: 'word' and 'clue'. The 'word' property should hold the word itself, and the 'clue' property should contain a cryptic clue for the word, limited to 6 words.`;

    const model = "meta/meta-llama-3-70b-instruct";
    const input = {
        system_prompt: "Generate a valid JSON string representing an array of objects from a given list of words. Each object should have two properties: 'word' and 'clue'. The 'word' property should be the word itself, and the 'clue' property should be a cryptic clue for the word, not exceeding 6 words. The output should not contain any additional text.",
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


router.post("/puzzles", async (req, res) => {

    try {
        if (req.body.quote) {
            let uniqueCharacters = getUniqueCharacters(req.body.quote);
            let uniqueWords = getUniqueWords(req.body.quote);
            let filteredWords = common_words.filter(word => word.length > 3 && word.length < 7).filter(word => !uniqueWords.includes(word));
            let valid_words = excludeWordsWithoutCharacters(filteredWords, uniqueCharacters);
            let selectedWords = selectWords(valid_words, uniqueCharacters);
            const answer = await (generateHints(selectedWords));
            const quote = await PuzzleModel.create({
                quote: req.body.quote,
                info: req.body.info,
                clues: extractArray(answer),
            });
            res.status(200).json(quote);
        } else if (req.body.puzzles) {
            const promises = req.body.puzzles.map(async (eachPuzzle) => {
                let uniqueCharacters = getUniqueCharacters(eachPuzzle.quote);
                let uniqueWords = getUniqueWords(eachPuzzle.quote);

                let filteredWords = common_words.filter(word => word.length > 3 && word.length < 7).filter(word => !uniqueWords.includes(word));

                let valid_words = excludeWordsWithoutCharacters(filteredWords, uniqueCharacters);

                let selectedWords = selectWords(valid_words, uniqueCharacters);

                const answer = await (generateHints(selectedWords));

                return PuzzleModel.create({
                    quote: eachPuzzle.quote,
                    info: eachPuzzle.info,
                    clues: extractArray(answer),
                });
            });

            Promise.all(promises).then((puzzles) => {
                res.status(200).json(puzzles);
            }).catch((error) => {
                console.error(error);
                res.status(500).send({ error: "An error occurred while creating the quotes." });
            });

        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while creating the quote." });
    }
});
router.post("/puzzles", async (req, res) => {

    try {
        if (req.body.quote) {
            let uniqueCharacters = getUniqueCharacters(req.body.quote);
            let uniqueWords = getUniqueWords(req.body.quote);
            let filteredWords = common_words.filter(word => word.length > 3 && word.length < 7).filter(word => !uniqueWords.includes(word));
            let valid_words = excludeWordsWithoutCharacters(filteredWords, uniqueCharacters);
            let selectedWords = selectWords(valid_words, uniqueCharacters);
            const answer = await (generateHints(selectedWords));
            const quote = await PuzzleModel.create({
                quote: req.body.quote,
                info: req.body.info,
                clues: extractArray(answer),
            });
            res.status(200).json(quote);
        } else if (req.body.quotes) {
            const promises = req.body.quotes.map(async (eachPuzzle) => {
                let uniqueCharacters = getUniqueCharacters(eachPuzzle.quote);
                let uniqueWords = getUniqueWords(eachPuzzle.quote);

                let filteredWords = common_words.filter(word => word.length > 3 && word.length < 7).filter(word => !uniqueWords.includes(word));

                let valid_words = excludeWordsWithoutCharacters(filteredWords, uniqueCharacters);

                let selectedWords = selectWords(valid_words, uniqueCharacters);

                const answer = await (generateHints(selectedWords));

                return PuzzleModel.create({
                    quote: eachPuzzle.quote,
                    info: eachPuzzle.info,
                    clues: extractArray(answer),
                });
            });

            Promise.all(promises).then((quotes) => {
                res.status(200).json(quotes);
            }).catch((error) => {
                console.error(error);
                res.status(500).send({ error: "An error occurred while creating the quotes." });
            });

        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while creating the quote." });
    }
});

router.get("/puzzle", async (req, res) => {
    try {
        const userId = req.userId;

        // Retrieve the user by user ID
        const user = await UserModel.findOne({ uid: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get the list of puzzles already in the puzzleProgress array
        const playedPuzzles = user.puzzleProgress.map(progress => progress.puzzleId);

        // Find a random puzzle that is not in the puzzleProgress array
        const [puzzle] = await PuzzleModel.aggregate([
            { $match: { _id: { $nin: playedPuzzles } } },
            { $sample: { size: 1 } }
        ]);

        if (!puzzle) {
            return res.status(404).json({ message: 'No new puzzles available' });
        }

        // Add the newly picked puzzle to the puzzleProgress array
        user.puzzleProgress.push({
            puzzleId: puzzle._id,
            completed: false,
            skipped: false,
            cluesUsed: 0,
            attempts: 0,
            timeTaken: 0,
        });
        await user.save();

        // Return the selected puzzle
        res.status(200).json(puzzle);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while fetching the puzzle." });
    }
});

module.exports = router;