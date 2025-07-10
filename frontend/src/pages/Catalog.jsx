import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/common/Footer";
import Course_Card from "../components/core/Catalog/Course_Card";
import Course_Slider from "../components/core/Catalog/Course_Slider";
import Loading from "./../components/common/Loading";
import { getCatalogPageData } from "../services/operations/courseDetailsAPI";
import { fetchCourseCategories } from "./../services/operations/courseDetailsAPI";

function Catalog() {
  const { catalogName } = useParams();
  const [active, setActive] = useState(1);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetchCourseCategories();
        const category = res.find(
          (ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName
        );
        if (category) {
          setCategoryId(category._id);
          return;
        } else setCategoryId("");
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, [catalogName]);

  useEffect(() => {
    if (categoryId) {
      (async () => {
        setLoading(true);
        try {
          const res = await getCatalogPageData(categoryId);
          setCatalogPageData(res);
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      })();
    }
  }, [categoryId]);

  return (
    <>
      {loading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <Loading />
        </div>
      ) : !loading && !catalogPageData ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center text-white text-4xl">
          No Courses found for selected Category
        </div>
      ) : (
        <>
          <div className="box-content bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
              <p className="text-sm text-richblack-300">
                {`Home / Catalog / `}
                <span className="text-yellow-25">
                  {catalogPageData?.selectedCategory?.name}
                </span>
              </p>
              <p className="text-3xl text-richblack-5">
                {catalogPageData?.selectedCategory?.name}
              </p>
              <p className="max-w-[870px] text-richblack-200">
                {catalogPageData?.selectedCategory?.description}
              </p>
            </div>
          </div>
          <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Courses to get you started</div>
            <div className="my-4 flex border-b border-b-richblack-600 text-sm">
              <p
                className={`px-4 py-2 ${
                  active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(1)}
              >
                Most Popular
              </p>
              {/* <p
                className={`px-4 py-2 ${
                  active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={() => setActive(2)}
              >
                New
              </p> */}
            </div>
            <Course_Slider
              Courses={catalogPageData?.selectedCategory?.courses}
            />
          </div>
          <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">
              Top courses in {catalogPageData?.differentCategory?.name}
            </div>
            <Course_Slider
              Courses={catalogPageData?.differentCategory?.courses}
            />
          </div>
          <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
            <div className="section_heading">Frequently Bought</div>
            <div className="py-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[300px]"} />
                  ))}
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
}

export default Catalog;
