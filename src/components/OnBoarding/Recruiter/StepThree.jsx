"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import Toast from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnBoardingContext";
import Image from "next/image";

const StepThree = () => {
  useEffect(() => {
    console.log("StepThree Mounted!");
  }, []);

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  // Form state
  const [companyDescription, setCompanyDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your company details have been saved successfully.",
      });
      setShowToast(true);
    }, 2000);
  };

  const simulateFileUpload = (file) => {
    const fileExt = file.name.split(".").pop().toUpperCase();
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      type: fileExt,
      progress: 0,
      isComplete: false,
    };

    setUploadedFiles((prev) => [...prev, newFile]);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.id === newFile.id) {
            const newProgress = f.progress + Math.floor(Math.random() * 10);

            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, isComplete: true };
            }

            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 300);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      simulateFileUpload(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateFileUpload(files[0]);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  return (
    <div className="flex gap-3 w-full max-w-[637px] min-h-[450px] flex-col items-center justify-center bg-white px-4 py-6 sm:px-6 md:px-8 lg:px-10 rounded-[24px] shadow-[0px_8px_18px_0px_rgba(19,17,28,0.12)]">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[30px]"
          >
            <Toast
              type={toastConfig.type}
              title={toastConfig.title}
              message={toastConfig.message}
              onClose={() => setShowToast(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold text-gray-900 text-center">
        Show Off Your Brand
      </h2>
      <p className="text-gray-500 text-center mb-4">
        Upload your logo and provide a description that highlights your company
        culture and values.
      </p>

      {/* Upload Company Logo */}
      <div className="w-full space-y-4 px-4 md:px-4">
        <div className="">
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Upload Company Logo
          </label>

          {/* File Upload Area */}
          {uploadedFiles.length === 0 && (
            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer ${
                isDragging ? "bg-gray-50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                accept="image/*"
              />
              <div className="flex gap-3 justify-center items-center">
                <Image
                  src="/assets/upload-arrow.svg"
                  height={20}
                  width={20}
                  alt="arrow"
                />
                <p className="text-gray-500">
                  Drag and Drop files here or{" "}
                  <span className="text-[#5E49D9] underline cursor-pointer">
                    Browse
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-100 border border-gray-200 rounded-lg p-4 relative"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#F0F4FA] p-2 rounded-lg">
                        {file.type === "PDF" ? (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M7 18H17V16H7V18Z" fill="#5E49D9" />
                            <path d="M17 14H7V12H17V14Z" fill="#5E49D9" />
                            <path d="M7 10H11V8H7V10Z" fill="#5E49D9" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.134 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z"
                              fill="#5E49D9"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 21C4.45 21 3.979 20.8043 3.587 20.413C3.19567 20.021 3 19.55 3 19V5C3 4.45 3.19567 3.979 3.587 3.587C3.979 3.19567 4.45 3 5 3H14L21 10V19C21 19.55 20.8043 20.021 20.413 20.413C20.021 20.8043 19.55 21 19 21H5ZM13 11V4H5V19H19V12H13V11ZM8 17C8 16.45 8.196 15.979 8.588 15.587C8.97933 15.1957 9.45 15 10 15C10.55 15 11.021 15.1957 11.413 15.587C11.8043 15.979 12 16.45 12 17H8ZM16 17C16 16.45 16.196 15.979 16.588 15.587C16.9793 15.1957 17.45 15 18 15V17H16Z"
                              fill="#5E49D9"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-gray-800 font-medium">
                          {file.name}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {file.size} • {file.type}
                        </div>
                      </div>
                    </div>
                    <div>
                      {file.isComplete ? (
                        <div className="text-green-600 flex items-center gap-1">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                              fill="currentColor"
                            />
                          </svg>
                          Complete
                        </div>
                      ) : (
                        <div className="text-[#5E49D9]">{file.progress}%</div>
                      )}
                    </div>
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      onClick={() => removeFile(file.id)}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        file.isComplete ? "bg-green-600" : "bg-[#5E49D9]"
                      }`}
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <button
                onClick={handleBrowseClick}
                className="text-[#5E49D9] text-sm hover:underline mt-2"
              >
                Upload another file
              </button>
            </div>
          )}
        </div>

        {/* Company Description */}
        <div className="w-full">
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Company Description
          </label>

          <Input
            type="text"
            placeholder="Briefly describe your company culture and mission."
            value={companyDescription}
            onChange={(e) => setCompanyDescription(e.target.value)}
          />
        </div>

        {/* Website */}
        <div className="w-full relative">
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Website
          </label>
          <Input
            type="text"
            placeholder="e.g., https://www.jobiverse.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <Image
            src="/assets/link.svg"
            height={25}
            width={25}
            alt="arrow"
            className="absolute right-4 top-[43px]"
          />
        </div>
      </div>

      {/* Save & Continue Button */}
      <div className="flex justify-center sm:justify-end mt-5 mb-5 sm:mt-3 sm:mb-0 w-full px-4">
        <Button
          className={`!font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${
            loading ? "!shadow-none" : "subtle-shadow"
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          Save & Continue
          {loading && <Spinner />}
        </Button>
      </div>
    </div>
  );
};

export default StepThree;
