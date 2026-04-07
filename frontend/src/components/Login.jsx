import React, { useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { ArrowLeft, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ onLoginSuccess = null }) => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation
  const validate = () => {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email))
      e.email = "Please enter a valid email";

    if (!password) e.password = "Password is required";

    return e;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      setSubmitError("");

      const response = await axios.post(
  "https://bytequiz-lc95.onrender.com/api/user/login",
  { email, password },
  { headers: { "Content-Type": "application/json" } }
);

      // Save token
      localStorage.setItem("authToken", response.data.token);

      // Notify app
      window.dispatchEvent(
        new CustomEvent("authChanged", {
          detail: { user: { email } },
        })
      );

      if (onLoginSuccess) onLoginSuccess();

      toast.success("Login successful! 🎉");
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Email or password is incorrect!";

      toast.error(message);
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.pageContainer}>
      {/* bubbles */}
      <div className={loginStyles.bubble1}></div>
      <div className={loginStyles.bubble2}></div>

      {/* back button */}
      <Link to="/" className={loginStyles.backButton}>
        <ArrowLeft className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>
          Home
        </span>
      </Link>

      <div className={loginStyles.formContainer}>
        <form
          onSubmit={handleSubmit}
          className={loginStyles.form}
          noValidate
        >
          <div className={loginStyles.formWrapper}>
            <div className={loginStyles.animatedBorder}>
              <div className={loginStyles.formContent}>

                {/* Heading */}
                <h2 className={loginStyles.heading}>
                  <span className={loginStyles.headingIcon}>
                    <LogIn
                      className={loginStyles.headingIconInner}
                    />
                  </span>
                  <span className={loginStyles.headingText}>
                    Login
                  </span>
                </h2>

                <p className={loginStyles.subtitle}>
                  Welcome back! Login to continue to ByteQuiz.
                </p>

                {/* Email */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>
                    Email
                  </span>

                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Mail
                        className={
                          loginStyles.inputIconInner
                        }
                      />
                    </span>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className={`${loginStyles.input} ${
                        errors.email
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className={loginStyles.errorText}>
                      {errors.email}
                    </p>
                  )}
                </label>

                {/* Password */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>
                    Password
                  </span>

                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Lock
                        className={
                          loginStyles.inputIconInner
                        }
                      />
                    </span>

                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className={`${loginStyles.input} ${
                        errors.password
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      } ${loginStyles.passwordInput}`}
                    />

                    <button
                      type="button"
                      className={
                        loginStyles.passwordToggle
                      }
                      onClick={() =>
                        setShowPassword((s) => !s)
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          className={
                            loginStyles.passwordToggleIcon
                          }
                        />
                      ) : (
                        <Eye
                          className={
                            loginStyles.passwordToggleIcon
                          }
                        />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className={loginStyles.errorText}>
                      {errors.password}
                    </p>
                  )}
                </label>

                {/* Submit */}
                {submitError && (
                  <p className={loginStyles.submitError}>
                    {submitError}
                  </p>
                )}

                <div
                  className={
                    loginStyles.buttonsContainer
                  }
                >
                  <button
                    type="submit"
                    className={
                      loginStyles.submitButton
                    }
                    disabled={loading}
                  >
                    <LogIn
                      className={
                        loginStyles.submitButtonIcon
                      }
                    />

                    <span
                      className={
                        loginStyles.submitButtonText
                      }
                    >
                      {loading
                        ? "Logging in..."
                        : "Login"}
                    </span>
                  </button>
                </div>

                {/* Signup */}
                <div
                  className={
                    loginStyles.signupContainer
                  }
                >
                  <div
                    className={
                      loginStyles.signupContent
                    }
                  >
                    <span
                      className={
                        loginStyles.signupText
                      }
                    >
                      Don't have an account?
                    </span>

                    <Link
                      to="/signup"
                      className={
                        loginStyles.signupLink
                      }
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
