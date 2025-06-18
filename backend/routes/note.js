const express = require("express");
const { createNote, getNotes, deleteNote } = require("../controllers/note");
const { isStudent, auth } = require("../middleware/auth");

const router = express.Router();

router.post("/create", auth, isStudent, createNote);
router.post("/getNotes", auth, isStudent, getNotes);
router.delete("/delete", auth, isStudent, deleteNote);

module.exports = router;
