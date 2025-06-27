const LiveClass = require("../models/liveClass");
const User = require("../models/user");

exports.createLiveClass = async (req, res) => {
  try {
    let {
      title,
      description,
      startTime,
      duration,
      platform,
      accessLink,
      status,
    } = req.body;
    const instructorId = req.user.id;
    if (
      !title ||
      !description ||
      !startTime ||
      !duration ||
      !platform ||
      !accessLink
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    const newLiveClass = await LiveClass.create({
      title,
      description,
      startTime,
      duration,
      platform,
      accessLink,
      instructor: instructorId,
      status,
    });
    await User.findByIdAndUpdate(
      instructorId,
      { $push: { liveClasses: newLiveClass._id } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: newLiveClass,
      message: "Live class published successfully",
    });
  } catch (error) {
    console.error("Error publishing live class:", error);
    return res.status(500).json({
      success: false,
      message: "Error publishing live class",
      error: error.message,
    });
  }
};

exports.getInstructorLiveClasses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const liveClasses = await LiveClass.find({ instructor: instructorId }).sort(
      {
        createdAt: -1,
      }
    );
    return res.status(200).json({
      success: true,
      data: liveClasses,
    });
  } catch (error) {
    console.error("Error fetching live classes:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch live classes",
    });
  }
};

exports.deleteLiveClass = async (req, res) => {
  try {
    const { liveClassId } = req.body;
    const liveClass = await LiveClass.findById(liveClassId);
    if (!liveClass) {
      return res.status(404).json({ message: "Live class not found" });
    }
    await User.findByIdAndUpdate(liveClass.instructor, {
      $pull: { liveClasses: liveClassId },
    });
    await LiveClass.findByIdAndDelete(liveClassId);
    return res.status(200).json({
      success: true,
      message: "Live class deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting live class:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting live class",
      error: error.message,
    });
  }
};
