
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { showSuccess, showError } from "../utils/toast";
import "./Auth.css";
import { Eye, EyeOff } from "lucide-react";
import baseUrl from "../api/axios";



const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Name must contain at least 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must contain at least 6 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (values, { resetForm }) => {
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/register`, {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      showSuccess(
        response.data?.message || "Registration successful!"
      );

      resetForm();

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">S4</div>
          <span>SRI04DEC</span>
        </div>

        <div className="auth-heading">
          <h1>Create account</h1>
          <p>Enter your details to get started.</p>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="field-error"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="field-error"
                />
              </div>


              <div className="password-wrapper">
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff size={20} strokeWidth={1.8} />
                  ) : (
                    <Eye size={20} strokeWidth={1.8} />
                  )}
                </button>
              </div>
              


              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />

                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="field-error"
                />
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
