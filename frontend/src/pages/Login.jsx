
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { showSuccess, showError } from "../utils/toast";
import "./Auth.css";
import { Eye, EyeOff } from "lucide-react";
import baseUrl from "../api/axios";


const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/login`, {
        email: values.email.trim(),
        password: values.password,
      });

      const data = response.data;

      // Backend token and user details are expected here.
      const token = data.token || data.accessToken;
      const user = data.user || data.data?.user;

      if (!token) {
        showError(
          "Login response has no token. Check your backend response."
        );
        return;
      }

      // Store authentication details.
      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      showSuccess(data.message || "Login successful!");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your email and password.";

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
          <h1>Welcome back</h1>
          <p>Enter your credentials to access your account.</p>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
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

              <div className="form-group">
                <label htmlFor="password">Password</label>


                <div className="password-wrapper">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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


                <ErrorMessage
                  name="password"
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
                  ? "Signing in..."
                  : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
