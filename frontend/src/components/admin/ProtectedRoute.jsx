// here we are writing the logic to protect the routes.(as of now, we did not protected the routes, so, one can be logged in as student and can still be able to access recruiter specific routes and we dont want that to happen. so we'll protect the routes)

import { useSelector } from "react-redux";
import store from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null || user.role !== "recruiter") {
      navigate("/");
    }
  }, []);
  return <>{children}</>;
};

export default ProtectedRoute;

// we are going to add every admin component inside <ProtectedRoute></ProtectedRoute> component, and it will act as children here.
