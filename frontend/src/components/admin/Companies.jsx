import React from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { useNavigate } from "react-router-dom";
import useGetAllCompanies from "../../hooks/useGetAllCompanies";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "../../redux/companySlice";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState(""); // in this input we are getting the text entered by the user
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-18">
        <div className="flex justify-between items-center my-5">
          <Input
            className="w-fit"
            placeholder="filter by name"
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <Button
            className="cursor-pointer"
            onClick={() => {
              navigate("/admin/companies/create");
            }}
          >
            new company
          </Button>
        </div>
        <CompaniesTable />
      </div>
    </div>
  );
};

export default Companies;
