const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("quote route");
});

module.exports = router;