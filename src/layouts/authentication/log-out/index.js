import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove all cookies
    Object.keys(Cookies.get()).forEach((cookie) => Cookies.remove(cookie));

    // Redirect to Sign In page after logout
    navigate("/authentication/sign-in");
  }, [navigate]);

  return null; // No UI needed for logout
}

export default Logout;
