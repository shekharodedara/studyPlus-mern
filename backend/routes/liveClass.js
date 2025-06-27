const express = require("express");
const { auth, isInstructor } = require("../middleware/auth");
const { createLiveClass, getInstructorLiveClasses, deleteLiveClass } = require("../controllers/liveClass");
const router = express.Router();

router.post("/createLiveClass", auth, isInstructor, createLiveClass);
router.get("/instructor-classes", auth, getInstructorLiveClasses);
router.delete("/deleteLiveClass", auth, isInstructor, deleteLiveClass);

module.exports = router;
