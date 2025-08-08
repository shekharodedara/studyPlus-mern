const LiveClass = require("../models/liveClass");
const User = require("../models/user");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createLiveClass = async (req, res) => {
  try {
    let {
      title,
      description,
      startTime,
      duration,
      status,
      price,
      participantLimit,
      sessions,
    } = req.body;
    const platform = "100 ms";
    const accessLink = "hms";
    if (typeof sessions === "string") {
      try {
        sessions = JSON.parse(sessions);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: "Invalid sessions format",
        });
      }
    }
    const instructorId = req.user.id;
    const thumbnail = req.files?.thumbnail;
    if (
      !title ||
      !description ||
      !startTime ||
      !duration ||
      !thumbnail ||
      !participantLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sessions are required for recurring live classes",
      });
    }
    for (const s of sessions) {
      if (!s.startTime || !s.lessonTitle || !s.lessonDescription) {
        return res.status(400).json({
          success: false,
          message:
            "Each session must have startTime, lessonTitle, and lessonDescription",
        });
      }
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    const thumbnailDetails = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME || "liveClassThumbnails"
    );
    const newLiveClass = await LiveClass.create({
      title,
      description,
      startTime,
      duration,
      price: Number(price),
      platform,
      accessLink,
      instructor: instructorId,
      status,
      thumbnail: thumbnailDetails.secure_url,
      participantLimit,
      sessions,
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
    await User.updateMany(
      {
        $or: [
          { liveClasses: liveClassId },
          { "liveClassPurchases.liveClassId": liveClassId },
        ],
      },
      {
        $pull: {
          liveClasses: liveClassId,
          liveClassPurchases: { liveClassId: liveClassId },
        },
      }
    );
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

exports.getPublishedLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find({ status: "Published" })
      .sort({ startTime: 1 })
      .populate("instructor", "name email");

    return res.status(200).json({
      success: true,
      data: liveClasses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching live classes",
      error: error.message,
    });
  }
};

exports.getLiveClassDetails = async (req, res) => {
  try {
    const { classId } = req.body;
    if (!classId) {
      return res.status(400).json({
        success: false,
        message: "Live class ID is required",
      });
    }
    const liveClass = await LiveClass.findById(classId)
      .populate("instructor", "-password")
      .exec();
    if (!liveClass) {
      return res.status(404).json({
        success: false,
        message: `Live class with ID ${classId} not found`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Live class details fetched successfully",
      data: liveClass,
    });
  } catch (error) {
    console.error("getLiveClassDetails ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getPurchasedLiveClasses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "liveClasses",
        select: "title description duration thumbnail price startTime status",
      })
      .select("liveClasses");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      liveClasses: user.liveClasses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchased live classes",
    });
  }
};
