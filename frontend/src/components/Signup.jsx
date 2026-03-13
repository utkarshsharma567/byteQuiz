import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyles";
import {
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signup = ({ onSignupSuccess = null }) => {
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // validation
  const validate = () => {
    const e = {};

    if (!name.trim()) e.name = "Name is required";

    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email";

    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";

    return e;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      setSubmitError("");

      const response = await axios.post(
        "http://localhost:5000/api/user/signup",
        { name, email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      toast.success("Account created successfully 🎉");

      if (onSignupSuccess) onSignupSuccess();

      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Signup failed. Try again.";

      toast.error(message);
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      {/* bubbles */}
      <div className={signupStyles.bubble1}></div>
      <div className={signupStyles.bubble2}></div>

      {/* back button */}
      <Link to="/login" className={signupStyles.backButton}>
        <ArrowLeft className={signupStyles.backButtonIcon} />
        <span className={signupStyles.backButtonText}>Back</span>
      </Link>

      <div className={signupStyles.formContainer}>
        <form onSubmit={handleSubmit} className={signupStyles.form} noValidate>
          <div className={signupStyles.formWrapper}>
            <div className={signupStyles.animatedBorder}>
              <div className={signupStyles.formContent}>
                {/* heading */}
                <h2 className={signupStyles.heading}>
                  <span className={signupStyles.headingIcon}>
                    <CheckCircle className={signupStyles.headingIconInner} />
                  </span>
                  <span className={signupStyles.headingText}>
                    Create Account
                  </span>
                </h2>

                <p className={signupStyles.subtitle}>
                  Join ByteQuiz and start playing quizzes.
                </p>

                {/* Name */}
                <label className={signupStyles.label}>
                  <span className={signupStyles.labelText}>Full Name</span>
                  <div className={signupStyles.inputContainer}>
                    <span className={signupStyles.inputIcon}>
                      <User className={signupStyles.inputIconInner} />
                    </span>

                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`${signupStyles.input} ${
                        errors.name
                          ? signupStyles.inputError
                          : signupStyles.inputNormal
                      }`}
                    />
                  </div>

                  {errors.name && (
                    <p className={signupStyles.errorText}>{errors.name}</p>
                  )}
                </label>

                {/* Email */}
                <label className={signupStyles.label}>
                  <span className={signupStyles.labelText}>Email</span>
                  <div className={signupStyles.inputContainer}>
                    <span className={signupStyles.inputIcon}>
                      <Mail className={signupStyles.inputIconInner} />
                    </span>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${signupStyles.input} ${
                        errors.email
                          ? signupStyles.inputError
                          : signupStyles.inputNormal
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className={signupStyles.errorText}>{errors.email}</p>
                  )}
                </label>

                {/* Password */}
                <label className={signupStyles.label}>
                  <span className={signupStyles.labelText}>Password</span>

                  <div className={signupStyles.inputContainer}>
                    <span className={signupStyles.inputIcon}>
                      <Lock className={signupStyles.inputIconInner} />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${signupStyles.input} ${
                        errors.password
                          ? signupStyles.inputError
                          : signupStyles.inputNormal
                      } ${signupStyles.passwordInput}`}
                    />

                    <button
                      type="button"
                      className={signupStyles.passwordToggle}
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? (
                        <EyeOff className={signupStyles.passwordToggleIcon} />
                      ) : (
                        <Eye className={signupStyles.passwordToggleIcon} />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className={signupStyles.errorText}>{errors.password}</p>
                  )}
                </label>

                {/* submit */}
                {submitError && (
                  <p className={signupStyles.submitError}>{submitError}</p>
                )}

                <div className={signupStyles.buttonsContainer}>
                  <button
                    type="submit"
                    className={signupStyles.submitButton}
                    disabled={loading}
                  >
                    <CheckCircle className="w-5 h-5" />

                    <span>{loading ? "Creating account..." : "Sign Up"}</span>
                  </button>
                </div>

                {/* login link */}
                <div className={signupStyles.loginPromptContainer}>
                  <div className={signupStyles.loginPromptContent}>
                    <span className={signupStyles.loginPromptText}>
                      Already have an account?
                    </span>

                    <Link to="/login" className={signupStyles.loginPromptLink}>
                      Login
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

export default Signup;
