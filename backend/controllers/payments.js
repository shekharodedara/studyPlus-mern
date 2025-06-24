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
  const { coursesId = [], books = [] } = req.body;
  const userId = req.user.id;
  const currency = "INR";
  let totalAmount = 0;
  if (coursesId.length > 0) {
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
        return res.status(500).json({ success: false, message: error.message });
      }
    }
  }
  if (books.length > 0) {
    for (const book of books) {
      if (!book.id || typeof book.price !== "number") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid book data" });
      }
      totalAmount += book.price;
    }
  }
  if (totalAmount === 0) {
    try {
      if (coursesId.length > 0) {
        await enrollStudents(coursesId, userId);
      }
      if (books.length > 0) {
        for (const book of books) {
          await addBookToUser(book, userId);
        }
      }
      return res.status(200).json({
        success: true,
        message: "Free content added successfully",
        free: true,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to add free content",
        error: error.message,
      });
    }
  }
  const options = {
    amount: Math.round(totalAmount * 100),
    currency,
    receipt: `receipt_${Date.now()}`,
  };
  try {
    const paymentResponse = await instance.instance.orders.create(options);
    res.status(200).json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not Initiate Order",
      razorpayError: error?.error || error.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    coursesId = [],
    books = [],
  } = req.body;

  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !userId
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
  try {
    if (coursesId.length > 0) {
      await enrollStudents(coursesId, userId);
    }
    if (books.length > 0) {
      for (const book of books) {
        await addBookToUser(book, userId);
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Payment Verified and Access Granted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const enrollStudents = async (courses, userId) => {
  if (!courses || !userId)
    throw new Error("Please provide data for Courses or UserId");

  for (const courseId of courses) {
    const enrolledCourse = await Course.findOneAndUpdate(
      { _id: courseId },
      { $addToSet: { studentsEnrolled: userId } },
      { new: true }
    );
    if (!enrolledCourse) throw new Error("Course not Found");

    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    });
    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          courses: courseId,
          courseProgress: courseProgress._id,
          coursePurchases: {
            courseId,
            purchasedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        enrolledStudent.firstName
      )
    );
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
          price: book.price,
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

exports.getPurchaseHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate({
        path: "courses",
        select: "courseName thumbnail price createdAt",
      })
      .select("ebooks courses");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const courseHistory = user.courses.map(course => ({
      id: course._id,
      title: course.courseName,
      thumbnail: course.thumbnail,
      price: course.price,
      purchasedAt: course.createdAt || null,
    }));
    const ebookHistory = user.ebooks.map(book => ({
      id: book.id,
      title: book.title,
      thumbnail: book.thumbnail,
      authors: book.authors,
      price: book.price,
      purchasedAt: book.purchasedAt,
    }));
    return res.status(200).json({
      success: true,
      purchases: {
        courses: courseHistory,
        ebooks: ebookHistory,
      },
    });
  } catch (err) {
    console.error("Error fetching purchase history:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchase history",
    });
  }
};