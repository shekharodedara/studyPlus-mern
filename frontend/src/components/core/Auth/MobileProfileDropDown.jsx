import { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Img from "./../../common/Img";
import { logout } from "../../../services/operations/authAPI";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { AiOutlineCaretDown, AiOutlineHome } from "react-icons/ai";
import { MdOutlineContactPhone } from "react-icons/md";
import { TbMessage2Plus } from "react-icons/tb";
import { PiBookOpenTextFill, PiNotebook } from "react-icons/pi";
import { fetchCourseCategories } from "./../../../services/operations/courseDetailsAPI";

export default function MobileProfileDropDown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [showCatalogLinks, setShowCatalogLinks] = useState(false);
  const [open, setOpen] = useState(false);
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  useOnClickOutside(ref, () => setOpen(false));
  const fetchSublinks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchCourseCategories();
      setSubLinks(res);
    } catch (error) {
      console.log("Could not fetch the category list = ", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && subLinks.length === 0) {
      fetchSublinks();
    }
  }, [open, fetchSublinks, subLinks.length]);

  if (!user) return null;
  return (
    <button className="relative sm:hidden" onClick={() => setOpen(true)}>
      <div className="flex items-center gap-x-1">
        <Img
          src={user?.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        <AiOutlineCaretDown className="text-sm text-richblack-100" />
      </div>
      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="absolute min-w-[120px] top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-lg border-[1px] border-richblack-700 bg-richblack-800"
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100">
              <VscDashboard className="text-lg" />
              Dashboard
            </div>
          </Link>
          <Link to="/" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 border-y border-richblack-700">
              <AiOutlineHome className="text-lg" />
              Home
            </div>
          </Link>
          <div>
            <button
              className="flex w-full items-center justify-between gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100"
              onClick={() => setShowCatalogLinks((prev) => !prev)}
            >
              <span className="flex items-center gap-x-1">
                <PiNotebook className="text-lg" />
                Catalog
              </span>
              <AiOutlineCaretDown
                className={`transition-transform ${
                  showCatalogLinks ? "rotate-180" : ""
                }`}
              />
            </button>
            {showCatalogLinks && subLinks?.length > 0 && (
              <div className="pl-6">
                {subLinks.map((category, index) => (
                  <Link
                    key={index}
                    to={`/catalog/${category.name
                      .split(" ")
                      .join("-")
                      .toLowerCase()}`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="py-2 px-2 text-sm text-richblack-200 hover:text-richblack-5">
                      {category.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/books" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 border-y border-richblack-700">
              <PiBookOpenTextFill className="text-lg" />
              Books
            </div>
          </Link>
          <Link to="/about" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 border-y border-richblack-700">
              <TbMessage2Plus className="text-lg" />
              About Us
            </div>
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)}>
            <div className="flex items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100">
              <MdOutlineContactPhone className="text-lg" />
              Contact Us
            </div>
          </Link>
          <div
            onClick={() => {
              dispatch(logout(navigate));
              setOpen(false);
            }}
            className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100"
          >
            <VscSignOut className="text-lg" />
            Logout
          </div>
        </div>
      )}
    </button>
  );
}
