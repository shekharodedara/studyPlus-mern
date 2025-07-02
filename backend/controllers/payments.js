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
const LiveClass = require("../models/liveClass");

exports.capturePayment = async (req, res) => {
  const { coursesId = [], books = [], liveClasses = [] } = req.body;
  const userId = req.user.id;
  const currency = "EUR";
  let totalAmount = 0;
  try {
    const user = await User.findById(userId).select(
      "courses ebooks liveClasses"
    );
    const validCourseIds = [];
    const alreadyPurchasedCourses = [];
    for (const courseId of coursesId) {
      const course = await Course.findById(courseId);
      if (!course)
        return res
          .status(404)
          .json({ success: false, message: `Course not found: ${courseId}` });
      const alreadyPurchased = user.courses.includes(courseId);
      if (alreadyPurchased) {
        alreadyPurchasedCourses.push(course.courseName || "Unnamed Course");
      } else {
        totalAmount += course.price;
        validCourseIds.push(courseId);
      }
    }
    const validBooks = [];
    const alreadyPurchasedBooks = [];
    for (const book of books) {
      if (!book.id || typeof book.price !== "number")
        return res
          .status(400)
          .json({ success: false, message: "Invalid book data" });
      const alreadyPurchased = user.ebooks.some((e) => e.id === book.id);
      if (alreadyPurchased) {
        alreadyPurchasedBooks.push(book.title || "Untitled Book");
      } else {
        totalAmount += book.price;
        validBooks.push(book);
      }
    }
    const validLiveClasses = [];
    const alreadyPurchasedLiveClasses = [];
    for (const lc of liveClasses) {
      if (!lc.id || typeof lc.price !== "number")
        return res
          .status(400)
          .json({ success: false, message: "Invalid liveClass data" });
      const alreadyPurchased = user.liveClasses.includes(lc.id);
      if (alreadyPurchased) {
        alreadyPurchasedLiveClasses.push(lc.title || "Untitled Live Class");
      } else {
        totalAmount += lc.price;
        validLiveClasses.push(lc);
      }
    }
    if (
      validCourseIds.length === 0 &&
      validBooks.length === 0 &&
      validLiveClasses.length === 0
    ) {
      return res.status(409).json({
        success: false,
        message: "Item already exist in your account.",
        duplicates: {
          courses: alreadyPurchasedCourses,
          books: alreadyPurchasedBooks,
          liveClasses: alreadyPurchasedLiveClasses,
        },
      });
    }
    if (totalAmount === 0) {
      if (validCourseIds.length > 0)
        await enrollStudents(validCourseIds, userId);
      if (validBooks.length > 0) {
        for (const book of validBooks) await addBookToUser(book, userId);
      }
      if (validLiveClasses.length > 0) {
        for (const lc of validLiveClasses) await addLiveClassToUser(lc, userId);
      }
      return res.status(200).json({
        success: true,
        message: "Free content added successfully",
      });
    }
    const options = {
      amount: Math.round(totalAmount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    const paymentResponse = await instance.instance.orders.create(options);
    return res.status(200).json({
      success: true,
      message: paymentResponse,
    });
  } catch (err) {
    console.error("Error in capturePayment:", err);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order",
      error: err.message,
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
    liveClasses = [],
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
    if (liveClasses.length > 0) {
      for (const lc of liveClasses) {
        await addLiveClassToUser(lc, userId);
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Payment Verified and Access Granted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addLiveClassToUser = async (liveClass, userId) => {
  if (!liveClass || !liveClass.id) throw new Error("Live class data missing");
  const enrolledLiveClass = await LiveClass.findByIdAndUpdate(
    liveClass.id,
    { $addToSet: { studentsEnrolled: userId } },
    { new: true }
  );
  if (!enrolledLiveClass) throw new Error("Live class not found");
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        liveClasses: liveClass.id,
        liveClassPurchases: {
          liveClassId: liveClass.id,
          purchasedAt: new Date(),
        },
      },
    },
    { new: true }
  );
  return updatedUser;
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
      .populate({
        path: "liveClasses",
        select: "title thumbnail price createdAt",
      })
      .select("ebooks courses liveClasses liveClassPurchases");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const courseHistory = user.courses.map((course) => ({
      id: course._id,
      title: course.courseName,
      thumbnail: course.thumbnail,
      price: course.price,
      purchasedAt: course.createdAt || null,
    }));
    const ebookHistory = user.ebooks.map((book) => ({
      id: book.id,
      title: book.title,
      thumbnail: book.thumbnail,
      authors: book.authors,
      price: book.price,
      purchasedAt: book.purchasedAt,
    }));
    const liveClassHistory = user.liveClasses.map((lc) => {
      const purchase = user.liveClassPurchases.find(
        (p) => p.liveClassId.toString() === lc._id.toString()
      );
      return {
        id: lc._id,
        title: lc.title,
        thumbnail: lc.thumbnail,
        price: lc.price,
        purchasedAt: purchase?.purchasedAt || null,
      };
    });
    return res.status(200).json({
      success: true,
      purchases: {
        courses: courseHistory,
        ebooks: ebookHistory,
        liveClasses: liveClassHistory,
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
