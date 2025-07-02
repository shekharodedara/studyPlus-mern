const express = require("express");
const { auth, isInstructor } = require("../middleware/auth");
const {
  createLiveClass,
  getInstructorLiveClasses,
  deleteLiveClass,
  getPublishedLiveClasses,
  getLiveClassDetails,
  getPurchasedLiveClasses,
} = require("../controllers/liveClass");
const router = express.Router();

router.post("/createLiveClass", auth, isInstructor, createLiveClass);
router.get("/instructor-classes", auth, getInstructorLiveClasses);
router.delete("/deleteLiveClass", auth, isInstructor, deleteLiveClass);
router.get("/getLiveClasses", auth, getPublishedLiveClasses);
router.post("/getLiveClassDetails", getLiveClassDetails);
router.get("/purchased-liveclasses", auth, getPurchasedLiveClasses);

module.exports = router;
