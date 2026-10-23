import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string().required("Password is required"),
});

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            ...values,
            email: values.email.trim().toLowerCase(),
          }
        );

        const { token, user } = response.data;

        if (!token) {
          toast.error("Login response did not contain a token.");
          return;
        }

        localStorage.setItem("token", token);

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }

        toast.success(
          response.data.message || "Login successful!"
        );

        navigate("/dashboard", { replace: true });
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Login failed. Check your email and password."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={formik.handleSubmit}>
        <h2>Welcome Back</h2>
        <p>Login to your account</p>

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="error-message">{formik.errors.email}</div>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="error-message">
            {formik.errors.password}
          </div>
        )}

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;