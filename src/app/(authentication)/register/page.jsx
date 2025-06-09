"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  initiateRegistration,
  verifyOTP,
  completeRegistration,
} from "@/actions/auth";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import LeftSection from "@/components/Register/LeftSection";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Toast from "@/components/ui/toast";
import Spinner from "@/components/ui/spinner";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("recruiter");
  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const showToast = (type, title, message) => {
    setToast({
      type,
      title,
      message,
    });
    setTimeout(() => setToast(null), 4000);
  };

  const showErrorToast = (message) => {
    showToast("error", "Error", message);
  };

  const showSuccessToast = (message) => {
    showToast("success", "Success", message);
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength === 5) return "Strong";
    if (strength >= 3) return "Moderate";
    return "Weak";
  };
  const getStrengthColor = (strength) => {
    switch (strength) {
      case "Strong":
        return "bg-green-500 text-green-600";
      case "Moderate":
        return "bg-yellow-500 text-yellow-600";
      case "Weak":
        return "bg-red-500 text-red-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };
  const getPasswordStrengthMessage = (password) => {
    const strength = getPasswordStrength(password);
    switch (strength) {
      case "Strong":
        return "Strong password!";
      case "Moderate":
        return "Moderate password. Add more special characters or numbers for better security.";
      case "Weak":
        return "Weak password. Use at least 8 characters with uppercase, lowercase, numbers, and special characters.";
      default:
        return "";
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleStep1Submit = async () => {
    // Clear previous errors
    setErrors({});

    if (role === "recruiter") {
      if (!companyName) {
        setErrors({ companyName: "Please enter your company name" });
        return;
      }
    } else {
      if (!firstName) {
        setErrors({ firstName: "Please enter your first name" });
        return;
      }
      if (!lastName) {
        setErrors({ lastName: "Please enter your last name" });
        return;
      }
    }

    if (!email) {
      setErrors({ email: "Please enter your email" });
      return;
    }

    setLoading(true);
    try {
      const name = role === "recruiter" ? companyName : `${firstName} ${lastName}`;
      const result = await initiateRegistration(email, name, role);
      if (result.error) {
        // Handle email exists error inline
        if (result.error.includes("already registered")) {
          setErrors({ email: result.error });
        } else {
          showErrorToast(result.error);
        }
      } else {
        setStep(2);
      }
    } catch (error) {
      showErrorToast("Failed to initiate registration");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      showErrorToast("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(email, fullOtp);
      if (result.error) {
        showErrorToast(result.error);
      } else {
        setStep(3);
      }
    } catch (error) {
      showErrorToast("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3Submit = async () => {
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      showErrorToast("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await completeRegistration(email, password);
      if (result.error) {
        showErrorToast(result.error);
      } else {
        showSuccessToast("Registration successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      showErrorToast("Failed to complete registration");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) handleStep1Submit();
    else if (step === 2) handleStep2Submit();
    else if (step === 3) handleStep3Submit();
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className="flex h-screen">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast {...toast} onClose={() => setToast(null)} />
        </div>
      )}

      <LeftSection
        title={
          <>
            Join <span className="text-colors-primary">JobiVerse</span> and
            Connect, Hire, Grow!
          </>
        }
        description="Find the talent that aligns with your company's interest from our talented candidates."
        buttonText="Login"
        buttonLink="/login"
        linkText="Already have an account?"
        linkHref="/login"
      />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center">
              Create Your Free Account
            </h2>
            <p className="text-colors-textSecondary text-[16px] mt-3 mb-6 font-[300] text-center">
              Ready to find your next star? Let's get you set up!
            </p>

            {/* Google Sign Up */}
            <button className="w-full text-colors-textPrimary text-[16px] flex items-center justify-center border border-[#00000066] rounded-[12px] px-[24px] gap-3 py-[12px] transition-all duration-500 ease-in-out mb-4 hover:bg-gray-100">
              <Image
                width={20}
                height={20}
                src="/assets/google.svg"
                alt="google-icon"
              />
              Register with Google
            </button>

            {/* Separator */}
            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-[#999999]"></div>
              <span className="mx-3 text-[#999999] text-sm">or</span>
              <div className="flex-1 h-px bg-[#999999]"></div>
            </div>

            {/* Role Selection */}
            <div className="flex w-full bg-gray-100 rounded-full mb-4">
              <button
                className={`flex-1 text-sm font-[400] rounded-l-full py-3 transition ${
                  role === "candidate"
                    ? "bg-[#DED7FF] text-colors-primary border-colors-primary border"
                    : "text-gray-500 bg-[#DCDCDD78]"
                }`}
                onClick={() => setRole("candidate")}
              >
                Job Seeker
              </button>
              <button
                className={`flex-1 py-3 text-sm font-[400] rounded-r-full transition ${
                  role === "recruiter"
                    ? "bg-[#DED7FF] text-colors-primary border-colors-primary border"
                    : "text-gray-500 bg-[#DCDCDD78]"
                }`}
                onClick={() => setRole("recruiter")}
              >
                Recruiter
              </button>
            </div>

            {role === "recruiter" ? (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Company Name
                </label>
                <Input
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={errors.companyName}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    First Name
                  </label>
                  <Input
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={errors.firstName}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Last Name
                  </label>
                  <Input
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={errors.lastName}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {role === "recruiter" ? "Company Email" : "Email"}
              </label>
              <Input
                placeholder={
                  role === "recruiter"
                    ? "Enter your Company Email"
                    : "Enter your Email"
                }
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <Button
              onClick={handleNext}
              className="w-full !font-[400] flex items-center justify-center gap-3 transition-all duration-300"
              disabled={loading}
            >
              Next
              {loading && (
                <>
                  <Spinner />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="w-full flex flex-col gap-4 items-center max-w-md">
            <Image
              width={180}
              height={180}
              src="/assets/verify.svg"
              alt="verify-email-icon"
            />
            <h2 className="text-2xl font-bold text-center">Almost there!</h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Enter the 6-digit verification code we sent to {email}. This helps
              us keep your account secure.
            </p>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className={`w-12 h-12 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 ${
                    digit ? "bg-[#F3F1FF] text-colors-primary" : "bg-white"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="w-full !font-[400] flex items-center justify-center gap-3 transition-all duration-300"
              disabled={loading || otp.join("").length !== 6}
            >
              Verify
              {loading && (
                <>
                  <Spinner />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 3: Password Creation */}
        {step === 3 && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center">
              Create a Password
            </h2>
            <p className="text-gray-600 text-center text-sm mb-4">
              Secure your account with a strong password.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full mb-2 ${
                    password.length > 0 && password.length < 8
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full ${
                    confirmPassword.length > 0 && confirmPassword !== password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">Password Strength:</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                    getStrengthColor(getPasswordStrength(password)).split(
                      " "
                    )[0]
                  }`}
                  style={{
                    width: `${
                      getPasswordStrength(password) === "Strong"
                        ? "100%"
                        : getPasswordStrength(password) === "Moderate"
                        ? "66%"
                        : "33%"
                    }`,
                  }}
                ></div>
              </div>
              <p
                className={`text-sm mt-1 ${
                  getStrengthColor(getPasswordStrength(password)).split(" ")[1]
                } !bg-transparent`}
              >
                {getPasswordStrengthMessage(password)}
              </p>
            </div>


            <Button
              onClick={handleNext}
              className="!font-[400] flex-1 flex items-center justify-center gap-3 transition-all duration-300 !w-full"
              disabled={
                loading || password !== confirmPassword || password.length < 8
              }
            >
              Register
              {loading && (
                <>
                  <Spinner />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
