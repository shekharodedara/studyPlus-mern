import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";
import Course_Slider from "../components/core/Catalog/Course_Slider";
import { getCatalogPageData } from "../services/operations/courseDetailsAPI";
import { MdOutlineRateReview } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { fadeIn } from "./../components/common/motionFrameVarients";
import backgroundImg1 from "../assets/Images/random bg img/coding bg1.jpg";
import backgroundImg2 from "../assets/Images/random bg img/coding bg2.jpg";
import backgroundImg3 from "../assets/Images/random bg img/coding bg3.jpg";
import backgroundImg4 from "../assets/Images/random bg img/coding bg4.jpg";
import backgroundImg5 from "../assets/Images/random bg img/coding bg5.jpg";
import backgroundImg6 from "../assets/Images/random bg img/coding bg6.jpeg";
import backgroundImg7 from "../assets/Images/random bg img/coding bg7.jpg";
import backgroundImg8 from "../assets/Images/random bg img/coding bg8.jpeg";
import backgroundImg9 from "../assets/Images/random bg img/coding bg9.jpg";
import backgroundImg10 from "../assets/Images/random bg img/coding bg10.jpg";
import backgroundImg111 from "../assets/Images/random bg img/coding bg11.jpg";

const randomImges = [
  backgroundImg1,
  backgroundImg2,
  backgroundImg3,
  backgroundImg4,
  backgroundImg5,
  backgroundImg6,
  backgroundImg7,
  backgroundImg8,
  backgroundImg9,
  backgroundImg10,
  backgroundImg111,
];

const Home = () => {
  const { user } = useSelector((state) => state.profile);
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [CatalogPageData, setCatalogPageData] = useState(null);
  const categoryID = "home";
  const isLoggedIn = !!user?.accountType;
  const dispatch = useDispatch();
  useEffect(() => {
    const bg = randomImges[Math.floor(Math.random() * randomImges.length)];
    setBackgroundImg(bg);
  }, []);

  useEffect(() => {
    const fetchCatalogPageData = async () => {
      const result = await getCatalogPageData(categoryID, dispatch);
      setCatalogPageData(result);
    };
    if (categoryID) {
      fetchCatalogPageData();
    }
  }, [categoryID]);

  return (
    <React.Fragment>
      <div>
        <div className="w-full h-[450px] md:h-[650px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover ">
          <img
            src={backgroundImg}
            alt="Background"
            className="w-full h-full object-cover "
          />
          <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg "></div>
        </div>
      </div>
      <div className=" ">
        <div className="relative h-[450px] md:h-[550px] justify-center mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white ">
          {user?.accountType !== "Instructor" && (
            <a href="/signup" target="_blank" rel="noopener noreferrer">
              <div
                className="z-0 group p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
      transition-all duration-200 hover:scale-95 w-fit"
              >
                <div
                  className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
        transition-all duration-200 group-hover:bg-richblack-900"
                >
                  <p>Become an Instructor</p>
                  <FaArrowRight />
                </div>
              </div>
            </a>
          )}
          <motion.div
            variants={fadeIn("left", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            className="text-center text-3xl lg:text-4xl font-semibold mt-7  "
          >
            Empower Your Future with
            <HighlightText text={"Coding Skills"} />
          </motion.div>
          <motion.div
            variants={fadeIn("right", 0.1)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.1 }}
            className=" mt-4 w-[90%] text-center text-base lg:text-lg font-bold text-richblack-300"
          >
            Discover a world of knowledge with our online platform. Whether
            you're interested in expert-led courses, live interactive classes,
            or insightful ebooks, we offer flexible, high-quality learning
            experiences across a wide range of subjects — all accessible from
            anywhere, at your own pace.
          </motion.div>
          {!isLoggedIn && (
            <div className="flex flex-row gap-7 mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                Learn More
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Book a Demo
              </CTAButton>
            </div>
          )}
        </div>
        <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
          <div className="">
            <CodeBlocks
              position={"lg:flex-row"}
              heading={
                <div className="text-3xl lg:text-4xl font-semibold">
                  Unlock Your
                  <HighlightText text={"coding potential "} />
                  with our online courses
                </div>
              }
              subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={{
                btnText: "try it yourself",
                linkto: !isLoggedIn ? "/signup" : "",
                active: true,
              }}
              ctabtn2={{
                btnText: "learn more",
                linkto: "/login",
                active: false,
              }}
              codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
              codeColor={"text-yellow-25"}
              backgroundGradient={"code-block1-grad"}
            />
          </div>
          <div>
            <CodeBlocks
              position={"lg:flex-row-reverse"}
              heading={
                <div className="w-[100%] text-3xl lg:text-4xl font-semibold lg:w-[50%]">
                  Start
                  <HighlightText text={"coding in seconds"} />
                </div>
              }
              subheading={
                "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
              }
              ctabtn1={{
                btnText: "Continue Lesson",
                link: !isLoggedIn ? "/signup" : "",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                link: "/signup",
                active: false,
              }}
              codeColor={"text-white"}
              codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
              backgroundGradient={"code-block2-grad"}
            />
          </div>
          <div className="mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent">
            <h2 className="text-white mb-6 text-2xl ">
              Popular Picks for You 🏆
            </h2>
            <Course_Slider
              Courses={CatalogPageData?.selectedCategory?.courses}
            />
          </div>
          <div className=" mx-auto box-content w-full max-w-maxContentTab px- py-12 lg:max-w-maxContent">
            <h2 className="text-white mb-6 text-2xl ">
              Top Enrollments Today 🔥
            </h2>
            <Course_Slider Courses={CatalogPageData?.mostSellingCourses} />
          </div>
          <ExploreMore />
        </div>
        <div className="bg-pure-greys-5 text-richblack-700 ">
          <div className="homepage_bg h-[310px]">
            <div className="w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto">
              <div className="h-[150px]"></div>
              <div className="flex flex-row gap-7 text-white ">
                <CTAButton active={true} linkto={!isLoggedIn ? "/signup" : "/"}>
                  <div className="flex items-center gap-3">
                    Explore Full Catalog
                    <FaArrowRight />
                  </div>
                </CTAButton>
                <CTAButton
                  active={false}
                  linkto={!isLoggedIn ? "/signup" : "/"}
                >
                  <div>Learn more</div>
                </CTAButton>
              </div>
            </div>
          </div>
          <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">
            <div className="flex flex-col lg:flex-row gap-5 mb-10 mt-[95px]">
              <div className="text-3xl lg:text-4xl font-semibold w-full lg:w-[45%]">
                Get the Skills you need for a
                <HighlightText text={"Job that is in demand"} />
              </div>
              <div className="flex flex-col gap-10 w-full lg:w-[40%] items-start">
                <div className="text-[16px]">
                  The modern StudyPlus is the dictates its own terms. Today, to
                  be a competitive specialist requires more than professional
                  skills.
                </div>
                {!isLoggedIn && (
                  <CTAButton active={true} linkto={"/signup"}>
                    <div>Learn more</div>
                  </CTAButton>
                )}
              </div>
            </div>
            <TimelineSection />
            <LearningLanguageSection />
          </div>
        </div>
        <div className="mt-14 w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white">
          <InstructorSection />
          <h1 className="text-center text-3xl lg:text-4xl font-semibold mt-8 flex justify-center items-center gap-x-3">
            Reviews from other learners{" "}
            <MdOutlineRateReview className="text-yellow-25" />
          </h1>
          <ReviewSlider />
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Home;
