const Category = require("../models/category");

const getRandomInt = (max) => Math.floor(Math.random() * max);
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    res.status(200).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.log("Error while creating Category");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while creating Category",
      error: error.message,
    });
  }
};
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      data: allCategories,
      message: "All allCategories fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching all allCategories");
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching all allCategories",
    });
  }
};
exports.getCategoryPageDetails = async (req, res) => {
  try {
    let { categoryId } = req.body;
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews instructor",
      })
      .exec();
    const categoriesWithCourses = allCategories.filter(
      (category) => category.courses && category.courses.length > 0
    );
    if (categoryId === "home") {
      const randomIndex = Math.floor(
        Math.random() * categoriesWithCourses.length
      );
      categoryId = categoriesWithCourses[randomIndex]._id;
    }
    const selectedCategory = await Category.findById(categoryId).populate({
      path: "courses",
      match: { status: "Published" },
      populate: "ratingAndReviews instructor",
    });
    if (!selectedCategory || selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published courses found for this category",
      });
    }
    const categoriesExceptSelected = categoriesWithCourses.filter(
      (cat) => cat._id.toString() !== categoryId.toString()
    );
    let differentCategory = null;
    if (categoriesExceptSelected.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * categoriesExceptSelected.length
      );
      differentCategory = categoriesExceptSelected[randomIndex];
    }
    const allCourses = categoriesWithCourses.flatMap((cat) => cat.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.error("Error in getCategoryPageDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
