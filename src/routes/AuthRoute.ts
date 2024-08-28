import { Router } from "express";
const UserModel = require("../models/user.model");

const router = Router();

router.post("/api/auth", async (req, res) => {

    try {

        const displayName = req.body.displayName || '';
        const [firstName, ...lastNameParts] = displayName.split(' ');
        const lastName = lastNameParts.join(' ');

        const existingUser = await UserModel.findOne({ uid: req.body.uid });

        if (existingUser) {
            // Check if any user information has changed
            const hasChanges = [
                'displayName',
                'firstName',
                'lastName',
                'email',
                'photoUrl',
                'phoneNumber',
                'metadata'
            ].some(field => existingUser[field] !== req.body[field]);

            if (hasChanges) {
                // Update only if there are changes
                const updatedUser = await UserModel.findOneAndUpdate(
                    { uid: req.body.uid },
                    {
                        displayName: req.body.displayName,
                        firstName,
                        lastName,
                        email: req.body.email,
                        photoUrl: req.body.photoUrl,
                        phoneNumber: req.body.phoneNumber,
                        metadata: req.body.metadata,
                    },
                    { new: true }
                );
                return res.status(200).json(updatedUser);
            } else {
                // No changes, return existing user
                return res.status(200).json(existingUser);
            }
        } else {
            // Create a new user if it doesn't exist
            const newUser = new UserModel({
                uid: req.body.uid,
                displayName: req.body.displayName,
                email: req.body.email,
                photoUrl: req.body.photoUrl,
                phoneNumber: req.body.phoneNumber,
                metadata: req.body.metadata,
            });
            await newUser.save();
            return res.status(201).json(newUser);
        }

    } catch (error) {
        console.error(error);
        let errorMessage = "An error occurred while processing the auth request.";

        if (error.name === 'MongoError') {
            if (error.code === 11000) {
                errorMessage = "Duplicate key error: A user with this UID already exists.";
            } else {
                errorMessage = `MongoDB error: ${error.message}`;
            }
        } else if (error.name === 'ValidationError') {
            errorMessage = `Validation error: ${error.message}`;
        } else {
            errorMessage = `Unexpected error: ${error.message}`;
        }

        res.status(500).send({ error: errorMessage });
    }
});


module.exports = router;
