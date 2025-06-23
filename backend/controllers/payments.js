const Rajorpay = require("razorpay");
const instance = require("../config/rajorpay");
const crypto = require("crypto");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
require("dotenv").config();
const User = require("../models/user");
const Course = require("../models/course");
const CourseProgress = require("../models/courseProgress");
const { default: mongoose } = require("mongoose");

exports.capturePayment = async (req, res) => {
  const { coursesId = [], isBook = false, book = null } = req.body;
  const userId = req.user.id;
  const currency = "INR";
  let totalAmount = 0;
  if (isBook) {
    if (!book || !book.id) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid book data" });
    }
    totalAmount = book.price || 0;
    if (totalAmount === 0) {
      try {
        await addBookToUser(book, userId);
        return res.status(200).json({
          success: true,
          message: "Book added successfully (free book)",
          free: true,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to add free book",
          error: error.message,
        });
      }
    }
  } else {
    if (coursesId.length === 0) {
      return res.json({ success: false, message: "Please provide Course Id" });
    }
    for (const course_id of coursesId) {
      try {
        const course = await Course.findById(course_id);
        if (!course) {
          return res
            .status(404)
            .json({ success: false, message: "Course not found" });
        }
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
          return res.status(400).json({
            success: false,
            message: "Student is already Enrolled in a course",
          });
        }
        totalAmount += course.price;
      } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  }
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
  };
  try {
    const paymentResponse = await instance.instance.orders.create(options);
    res.status(200).json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not Initiate Order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    coursesId,
    isBook = false,
    book,
  } = req.body;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !userId ||
    (isBook && !book) ||
    (!isBook && !coursesId)
  ) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Signature" });
  }
  if (isBook) {
    try {
      await addBookToUser(book, userId);
      return res.status(200).json({ success: true, message: "Book Purchased" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    try {
      await enrollStudents(coursesId, userId);
      return res
        .status(200)
        .json({ success: true, message: "Payment Verified" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide data for Courses or UserId",
    });
  }
  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, message: "Course not Found" });
      }
      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const addBookToUser = async (book, userId) => {
  if (!book || !book.id) throw new Error("Book data missing");
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        ebooks: {
          id: book.id,
          title: book.title,
          authors: book.authors || [],
          thumbnail: book.thumbnail || "",
          purchasedAt: new Date(),
        },
      },
    },
    { new: true }
  );
  if (!updatedUser) throw new Error("User not found");
  return updatedUser;
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;
  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }
  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
};