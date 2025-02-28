"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import LeftSection from "@/components/Register/LeftSection";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("recruiter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to the next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex h-screen">
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
        {step === 1 && (
          <div className="w-full max-w-md">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center">
              Create Your Free Account
            </h2>
            <p className="text-colors-textSecondary text-[16px] mt-3 mb-6 font-[300] text-center">
              Ready to find your next star? Let’s get you set up!
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

            {/* Role Selection Tabs */}
            <div className="flex w-full bg-gray-100 rounded-full mb-4 ">
              <button
                className={`flex-1  text-sm font-[400] rounded-l-full py-3 transition ${
                  role === "job_seeker"
                    ? "bg-[#DED7FF] text-colors-primary border-colors-primary border"
                    : "text-gray-500 bg-[#DCDCDD78]"
                }`}
                onClick={() => setRole("job_seeker")}
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

            {/* Inputs */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                {role === "recruiter" ? "Company Email" : "Email"}
              </label>
              <Input
                placeholder="Enter your Company Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Next Button */}
            <Button onClick={handleNext} className="w-full f!font-[400]">
              Next
            </Button>

            <div className="w-full md:hidden flex justify-center items-center mt-2">
              <p className="text-[#161819AB] text-sm mt-4">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-colors-primary hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        )}

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
              Enter the 6-digit verification code we sent to your email. This
              helps us keep your Jobiverse account secure.
            </p>

            {/* OTP Input Boxes */}
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

            {/* Verify Button */}
            <Button onClick={handleNext} className="w-full !font-[400]">
              Verify
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center">
              Create a Password
            </h2>
            <p className="text-gray-600 text-center text-sm mb-4">
              Secure your account with a strong password.
            </p>

            {/* Password Input */}
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
                    <EyeOff className="w-5 h-5 text-gray-500" /> // Lucide EyeOff icon
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" /> // Lucide Eye icon
                  )}
                </button>
              </div>
              {password.length > 0 && password.length < 8 && (
                <p className="text-red-500 text-sm">
                  Password must be at least 8 characters long.
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
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
                    <EyeOff className="w-5 h-5 text-gray-500" /> // Lucide EyeOff icon
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" /> // Lucide Eye icon
                  )}
                </button>
              </div>
              {confirmPassword.length > 0 && confirmPassword !== password && (
                <p className="text-red-500 text-sm">Passwords do not match.</p>
              )}
            </div>

            {/* Password Strength Indicator */}
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

            {/* Buttons */}
            <div className="flex gap-2">
              <Button className="!font-[400] flex-1">Register</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
