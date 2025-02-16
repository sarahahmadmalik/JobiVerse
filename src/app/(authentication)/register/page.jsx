"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LeftSection from "@/components/Register/LeftSection";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("recruiter"); // 'job_seeker' or 'recruiter'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

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
            <p className="text-gray-600 text-sm mb-6 text-center">
              Ready to find your next star? Let’s get you set up!
            </p>

            {/* Google Sign Up */}
            <button className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-100">
              <FcGoogle className="mr-2 text-xl" />
              Register with Google
            </button>

            {/* Separator */}
            <div className="flex items-center my-3">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="mx-3 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
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
            <div className="mb-4">
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
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                Verify email
              </a>
            </div>

            {/* Next Button */}
            <Button onClick={handleNext} className="w-full">
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold">Verify Your Email</h2>
            <p className="text-gray-600 text-sm mb-4">
              Enter the OTP sent to your email.
            </p>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mb-3"
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Verify & Continue
              </Button>
            </div>
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
