"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LeftSection from "@/components/Register/LeftSection";
import Image from "next/image";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("recruiter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      <LeftSection />
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
              <Image width={20} height={20} src="/assets/google.svg" />
              Register with Google
            </button>

            {/* Separator */}
            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-[#999999]"></div>
              <span className="mx-3 text-[#999999] text-sm">or</span>
              <div className="flex-1 h-px bg-[#999999]"></div>
            </div>

            {/* Role Selection */}
            <div className="flex w-full bg-gray-100 rounded-lg mb-4 p-1">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                  role === "job_seeker"
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500"
                }`}
                onClick={() => setRole("job_seeker")}
              >
                Job Seeker
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                  role === "recruiter"
                    ? "bg-purple-200 text-purple-700"
                    : "text-gray-500"
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
                Company Email
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
          </div>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col gap-4 items-center max-w-md">
            <Image width={180} height={180} src="/assets/verify.svg" />
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
            <h2 className="text-2xl font-bold">Create a Password</h2>
            <p className="text-gray-600 text-sm mb-4">
              Secure your account with a strong password.
            </p>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-3"
            />
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button className="flex-1">Finish Registration</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
