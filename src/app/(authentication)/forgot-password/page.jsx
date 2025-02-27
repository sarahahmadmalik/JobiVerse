"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LeftSection from "@/components/Register/LeftSection";
import Image from "next/image";
import Link from "next/link";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex h-screen">
      <LeftSection
        title={
          <>
            <span className="text-colors-primary">Forgot Password?</span>
          </>
        }
        description="Enter your email and follow the steps to reset your password."
        buttonText="Login"
        buttonLink="/login"
        linkText="Remembered your password?"
        linkHref="/login"
      />

      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        {step === 1 && (
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center">
              Reset Your Password
            </h2>
            <p className="text-gray-600 text-sm text-center mt-3 mb-6">
              Enter your email to receive a verification code.
            </p>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleNext} className="w-full">
              Send OTP
            </Button>
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
            <h2 className="text-2xl font-bold text-center">
              Verify Your Email
            </h2>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Enter the 6-digit OTP sent to your email.
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
            <Button onClick={handleNext} className="w-full">
              Verify OTP
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-center">Check Your Email</h2>
            <p className="text-gray-600 text-sm text-center mt-4 mb-6">
              A password reset link has been sent to your email. Click the link
              to reset your password.
            </p>
            <Button
              className="w-full my-2"
              onClick={() => (window.location.href = "/login")}
            >
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
