import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../utils/constants";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import store from "../../redux/store";
import { setLoading } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
    // e.target.files is an array of uploaded files, and by doind .[0], we are getting the first uploaded file, and by doing optional chaining (?.) we are preventing errors if no file is selected.
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "account created successfully");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "failed to create account");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 'multipart/form-data', usually means you’re sending files + text fields (like uploading profile pic + name/email).

  //headers: { "Content-Type": "multipart/form-data" } -
  //Tells the backend that you’re sending a file upload request (not JSON).
  //This is necessary when sending files/images

  //withCredentials: true -
  //Ensures cookies / authentication tokens are included in the request.
  //Without this, the browser won’t send cookies (like JWT stored in a cookie) to your backend

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">signup</h1>
          <div className="my-2">
            <Label className="mb-1">Full name</Label>
            <Input
              type="text"
              placeholder="name"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
            />
          </div>
          <div className="my-2">
            <Label className="mb-1">Email</Label>
            <Input
              type="email"
              placeholder="something@gmail.com"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>
          <div className="my-2">
            <Label className="mb-1">Phone no.</Label>
            <Input
              type="text"
              placeholder="90********"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
            />
          </div>
          <div className="my-2">
            <Label className="mb-1">Password</Label>
            <Input
              type="password"
              placeholder="*****"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="option-one">student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="option-two">recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2 ml-4">
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                className="cursor-pointer"
                onChange={changeFileHandler}
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4 cursor-pointer">
              <Loader2 className="mr-2 h-4 w-4 animate-spin " />
              please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 cursor-pointer">
              Signup
            </Button>
          )}

          <span className="text-sm">
            Already have an account?
            <Link to="/login" className="ml-1 text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
