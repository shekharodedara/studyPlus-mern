import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { liveClassEndpoints } from "../apis";

export const publishLiveClassAPI = async (formData, token) => {
  try {
    const response = await apiConnector(
      "POST",
      liveClassEndpoints.CREATE_LIVE_CLASS_API,
      formData,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create live class");
    }
    toast.success("Live class published successfully");
    return response.data.data;
  } catch (error) {
    console.error("PUBLISH_LIVE_CLASS_API ERROR:", error);
    toast.error(error.message || "Something went wrong");
    return null;
  }
};

export const getInstructorLiveClasses = async (token) => {
  let result = [];
  try {
    const res = await apiConnector(
      "GET",
      liveClassEndpoints.GET_INSTRUCTOR_LIVE_CLASSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (res?.data?.success) {
      result = res.data.data;
    } else {
      toast.error("Failed to fetch live classes");
    }
  } catch (error) {
    console.error("LIVE CLASS FETCH ERROR:", error);
    toast.error("Something went wrong");
  }
  return result;
};

export const deleteLiveClassAPI = async (liveClassId, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "DELETE",
      liveClassEndpoints.DELETE_LIVE_CLASS_API,
      { liveClassId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete live class");
    }
    toast.success("Live class deleted successfully");
    result = response.data;
  } catch (error) {
    console.error("deleteLiveClassAPI ERROR:", error);
    toast.error(error.message || "Something went wrong");
  }
  return result;
};

export const getStudentLiveClassesAPI = async (token) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      liveClassEndpoints.GET_LIVE_CLASSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (response?.data?.success) {
      result = response.data.data;
    } else {
      toast.error("Failed to fetch live classes");
    }
  } catch (error) {
    console.error("getLiveClassesAPI ERROR:", error);
    toast.error(error.message || "Something went wrong");
  }
  return result;
};

export const getLiveClassDetailsAPI = async (classId, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      liveClassEndpoints.GET_LIVE_CLASS_DETAILS_API,
      { classId },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch class details");
    }
    result = response.data.data;
  } catch (error) {
    console.error("getLiveClassDetailsAPI ERROR:", error);
    toast.error(error.message || "Something went wrong");
  }
  return result;
};

export async function getUserPurchasedLiveClasses(token) {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      liveClassEndpoints.GET_PURCHASED_LIVE_CLASSES_API,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.liveClasses;
  } catch (error) {
    console.log("GET_USER_PURCHASED_LIVE_CLASSES_API ERROR:", error);
    toast.error("Could not fetch purchased live classes");
  }
  return result;
}