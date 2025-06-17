const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourseDetails,
  getAllCourses,
  getFullCourseDetails,
  editCourse,
  deleteCourse,
  getInstructorCourses,
} = require("../controllers/course");
const { updateCourseProgress } = require("../controllers/courseProgress");
const {
  createCategory,
  showAllCategories,
  getCategoryPageDetails,
} = require("../controllers/category");
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/section");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/subSection");
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../controllers/ratingAndReview");
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middleware/auth");

router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

router.post("/getCourseDetails", getCourseDetails);
router.get("/getAllCourses", getAllCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.post("/editCourse", auth, isInstructor, editCourse);
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// Category can Only be Created by Admin
router.post("/createCategory", auth, isInstructor || isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", getCategoryPageDetails);

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;
