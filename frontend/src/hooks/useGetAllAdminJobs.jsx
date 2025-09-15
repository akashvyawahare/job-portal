import React from "react";
import { useEffect } from "react";
import { JOB_API_ENDPOINT } from "../utils/constants";
import { useDispatch } from "react-redux";
import { setAllAdminJobs, setAllJobs } from "../redux/jobSlice";
import axios from "axios";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/getadminjobs`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllAdminJobs();
  }, []);
};

export default useGetAllAdminJobs;
