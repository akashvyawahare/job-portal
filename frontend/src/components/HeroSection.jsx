import { Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { setSearchedQuery } from "../redux/jobSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };
  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          India's no. 1 job hunt website
        </span>
        <h1 className="text-5xl font-bold">
          Search, Apply & <br /> get your{" "}
          <span className="text-[#6A38C2]">DREAM JOB</span>
        </h1>
        <p>
          Discover your next career move with us! Browse thousands of verified
          job opportunities, connect with top employers, and take the next step
          toward your dream career, all in one place
        </p>
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="find your dream job"
            className="outline-none border-none w-full"
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            onClick={searchJobHandler}
            className="rounded-r-full bg-[#6A38C2] cursor-pointer"
          >
            <Search className="h-5 w-5 " />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
