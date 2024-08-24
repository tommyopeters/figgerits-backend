export { };

const mongoose = require('mongoose');
const QuoteSchema = new mongoose.Schema(
    {
        quote: {
            type: String,
            required: [true, "Please provide a quote"],
        },
        // language: {
        //     type: String,
        //     required: true,
        // },
        // tags: {
        //     type: [String],
        //     required: true,
        // },
        info: {
            type: String,
            required: true,
        },
        // encryptedQuote: {
        //     type: String,
        //     required: true,
        // },
        //   characterMap: { 'T': 1, 'h': 2, 'e': 3, ... },
        // characterMap: {
        //     type: Map,
        //     of: Number,
        //     required: true,
        // },
        hints: [
            {
                word: {
                    type: String,
                    required: true,
                },
                hint: {
                    type: String,
                    required: true,
                },
                //         originalWord: {
                //             type: String,
                //             required: true,
                //         },
            },
        ],
    },
    {
        timestamps: true,
    })

const Quote = mongoose.model('Quote', QuoteSchema);

module.exports = Quote;