import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints, noteEndpoints, catalogData } from "../apis";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  ADD_CATEGORY_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;
const { GET_NOTES_API, ADD_NOTE_API, DELETE_NOTE_API } = noteEndpoints;

export const createCategory = async (categoryData, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      ADD_CATEGORY_API,
      categoryData,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );
    console.log("ADD_CATEGORY_API RESPONSE:", response);
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to create category");
    }
    toast.success("Category created successfully");
    result = response.data.data;
  } catch (error) {
    console.log("ADD_CATEGORY_API ERROR:", error);
    toast.error(error.message || "Something went wrong");
  }
  return result;
};

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const getCatalogPageData = async (categoryId) => {
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId }
    );
    if (!response?.data?.success)
      throw new Error("Could not Fetch Category page data");
    result = response?.data?.data;
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    result = error.response?.data.data;
  }
  return result;
};

export const fetchCourseDetails = async (courseId) => {
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR:", error);
    result = error.response.data;
  }
  return result;
};

export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }
    result = response?.data?.data;
  } catch (error) {
    toast.error(error.message);
  }
  return result;
};

export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details");
    }
    result = response?.data?.data;
    toast.success("Course Details Added Successfully");
  } catch (error) {
    console.log("CREATE COURSE API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details");
    }
    result = response?.data?.data;
    toast.success("Course Details Updated Successfully");
  } catch (error) {
    console.log("EDIT COURSE API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section");
    }
    result = response?.data?.updatedCourseDetails;
    toast.success("Course Section Created");
  } catch (error) {
    console.log("CREATE SECTION API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const createSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture");
    }
    result = response?.data?.data;
    toast.success("Lecture Added");
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section");
    }
    result = response?.data?.data;
    toast.success("Course Section Updated");
  } catch (error) {
    console.log("UPDATE SECTION API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const updateSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture");
    }
    result = response?.data?.data;
    toast.success("Lecture Updated");
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section");
    }
    result = response?.data?.data;
    toast.success("Course Section Deleted");
  } catch (error) {
    console.log("DELETE SECTION API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture");
    }
    result = response?.data?.data;
    toast.success("Lecture Deleted");
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

export const fetchInstructorCourses = async (token) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses");
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR:", error);
    toast.error(error.message);
  }
  return result;
};

export const deleteCourse = async (data, token) => {
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course");
    }
    toast.success("Course Deleted");
  } catch (error) {
    console.log("DELETE COURSE API ERROR:", error);
    toast.error(error.message);
  }
};

export const getFullDetailsOfCourse = async (courseId, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.data;
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR:", error);
    result = error.response.data;
  }
  return result;
};

export const markLectureAsComplete = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture Completed");
    result = true;
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR:", error);
    toast.error(error.message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating");
    }
    toast.success("Rating Created");
    success = true;
  } catch (error) {
    success = false;
    console.log("CREATE RATING API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return success;
};

export const addNote = async (data, token) => {
  const toastId = toast.loading("Saving note...");
  let success = false;
  try {
    const response = await apiConnector("POST", ADD_NOTE_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not create note");
    }
    toast.success("Note saved successfully");
    success = true;
  } catch (error) {
    console.log("CREATE_NOTE_API ERROR >>>", error);
    toast.error(error.message || "Failed to save note");
  } finally {
    toast.dismiss(toastId);
  }
  return success;
};

export const getNotes = async (videoId, token) => {
  let result = [];
  try {
    const response = await apiConnector(
      "POST",
      GET_NOTES_API,
      { videoId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch notes");
    }
    result = response.data.data;
  } catch (error) {
    console.log("GET_NOTES_API ERROR >>>", error);
    toast.error(error.message || "Failed to load notes");
  }
  return result;
};

export const deleteNote = async (noteId, token) => {
  let success = false;
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_NOTE_API,
      { noteId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could not delete note");
    }
    toast.success("Note deleted");
    success = true;
  } catch (error) {
    console.log("DELETE_NOTE_API ERROR >>>", error);
    toast.error(error.message || "Failed to delete note");
  }
  return success;
};

export async function getBooks(
  category = "bestseller",
  country = "IN",
  maxResults = 40,
  startIndex = 0
) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    category
  )}&filter=ebooks&maxResults=${maxResults}&startIndex=${startIndex}&printType=books&country=${country}&key=${
    import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY
  }`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch books");
  return await response.json();
}

export async function getBookDetails(bookId, country = "IN") {
  const url = `https://www.googleapis.com/books/v1/volumes/${bookId}?country=${country}&key=${
    import.meta.env.VITE_APP_GOOGLE_BOOKS_API_KEY
  }`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch book details");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw new Error(error.message || "Failed to load book details");
  }
}
