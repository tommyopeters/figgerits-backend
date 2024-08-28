export { };

const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: [true, "Please provide a name"],
        },
        firstName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },
        metadata: {
            type: Object,
            required: false,
        },
        phoneNumber: {
            type: String,
            required: false,
        },
        photoUrl: {
            type: String,
            required: false,
        },
        uid: {
            type: String,
            required: true,
            unique: true,
        }
    },
    {
        timestamps: true,
    })

const User = mongoose.model('User', UserSchema);

module.exports = User;