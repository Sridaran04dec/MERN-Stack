import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must contain at least 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            ...values,
            name: values.name.trim(),
            email: values.email.trim().toLowerCase(),
          }
        );

        toast.success(
          response.data.message || "Registration successful!"
        );

        resetForm();
        navigate("/login");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={formik.handleSubmit}>
        <h2>Create Account</h2>
        <p>Register to get started</p>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          autoComplete="name"
          {...formik.getFieldProps("name")}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="error-message">{formik.errors.name}</div>
        )}

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
          placeholder="Minimum 6 characters"
          autoComplete="new-password"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <div className="error-message">
            {formik.errors.password}
          </div>
        )}

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Registering..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;