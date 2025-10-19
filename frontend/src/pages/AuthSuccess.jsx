import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      toast.success("Logged in successfully 🚀");
      navigate("/dashboard");
    } else {
      toast.error("Something went wrong with Google login!");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex h-screen items-center justify-center text-xl text-cyan-500">
      Verifying your account...
    </div>
  );
};

export default AuthSuccess;
