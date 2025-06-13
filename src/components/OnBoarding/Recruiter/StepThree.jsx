"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import Toast from "@/components/ui/toast";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "@/contexts/OnBoardingContext/OnboardingContext";
import Image from "next/image";
import { useUploadThing } from "@/utils/uploadthing";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import { X } from "lucide-react";
const StepThree = () => {
  const { nextStep, updateFormData } = useOnboarding();
  const { fetchData, isLoading, error } = useOnboardingData("step-three", "recruiter");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastConfig, setToastConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  // Form state
  const [companyDescription, setCompanyDescription] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
  onClientUploadComplete: (res) => {
    console.log("Upload complete:", res); // Add this for debugging
   if (res) {
      setUploadedFiles(prev => prev.map(file => ({
        ...file,
       url: res[0].url,
        isComplete: true,
        progress: 100
      })));
      setToastConfig({
        type: "success",
        title: "Upload Complete",
        message: "Your file has been uploaded successfully"
      });
      setShowToast(true);
    }
  },
  onUploadError: (error) => {
    console.error("Upload error:", error);
    setToastConfig({
      type: "error",
      title: "Upload Failed",
      message: error.message || "Failed to upload image",
    });
    setShowToast(true);
    setUploadedFiles([]);
  },
});
const handleFileUpload = async (file) => {
  // Clear previous files
  setUploadedFiles([]);

  // Create new file object
  const newFile = {
    id: Date.now(),
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
    type: file.name.split('.').pop()?.toUpperCase() || "IMAGE",
    progress: 0,
    isComplete: false,
    url: null
  };

  setUploadedFiles([newFile]);

  // Store interval ID to clear later
  let intervalId = setInterval(() => {
    setUploadedFiles(prev => {
      // Only update progress if not already complete
      if (prev[0]?.isComplete) {
        clearInterval(intervalId);
        return prev;
      }
      return prev.map(f => ({
        ...f,
        progress: Math.min(f.progress + 10, 90) // Cap at 90% for simulation
      }));
    });
  }, 300);

  try {
    const uploadResult = await startUpload([file]);
    
    // Manually handle completion if onClientUploadComplete isn't firing
    if (uploadResult && uploadResult[0]?.fileUrl) {
      clearInterval(intervalId);
      setUploadedFiles(prev => prev.map(file => ({
        ...file,
        url: uploadResult[0].fileUrl,
        isComplete: true,
        progress: 100
      })));
      
      // Show success toast
      setToastConfig({
        type: "success",
        title: "Upload Complete",
        message: "Your file has been uploaded successfully"
      });
      setShowToast(true);
    }
  } catch (err) {
    console.error("Upload failed:", err);
    clearInterval(intervalId);
    setUploadedFiles([]);
    setToastConfig({
      type: "error",
      title: "Upload Failed",
      message: err.message || "Failed to upload file"
    });
    setShowToast(true);
  }
};
  const handleSave = async () => {
    if (uploadedFiles.length === 0 || !uploadedFiles[0].url) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: "Please upload your company logo",
      });
      setShowToast(true);
      return;
    }

    try {
      setLoading(true);
      
      const logoUrl = uploadedFiles[0].url;

      await fetchData({
        method: "POST",
        body: {
          companyDescription,
          socialLinks,
          logoUrl
        }
      });

      setToastConfig({
        type: "success",
        title: "Success!",
        message: "Your Branding details have been saved successfully.",
      });
      setShowToast(true);

      setTimeout(() => {
        nextStep({
          companyDescription,
          socialLinks,
          logoUrl
        });
      }, 2000);
    } catch (err) {
      setToastConfig({
        type: "error",
        title: "Error",
        message: error || "Failed to save your branding details",
      });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };


  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
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
      handleFileUpload(files[0]);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
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
              className={`upload-area rounded-lg p-4 text-center cursor-pointer ${
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
                      <X size={20} />
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

        {/* Social Links */}
        <div className="w-full space-y-3">
          <label className="block mb-2 text-colors-textPrimary text-sm font-[400]">
            Social Media Links
          </label>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Twitter profile URL"
              value={socialLinks.twitter}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Facebook page URL"
              value={socialLinks.facebook}
              onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Instagram profile URL"
              value={socialLinks.instagram}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <Input
              type="text"
              placeholder="LinkedIn company page URL"
              value={socialLinks.linkedin}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Save & Continue Button */}
      <div className="flex justify-center sm:justify-end mt-5 mb-5 sm:mt-3 sm:mb-0 w-full px-4">
        <Button
          className={`!font-[400] !text-[16px] flex items-center justify-center gap-3 transition-all duration-300 ${
            loading || isUploading ? "!shadow-none" : "subtle-shadow"
          }`}
          onClick={handleSave}
          disabled={loading}
        >
          Save & Continue
          {(loading || isUploading) && <Spinner />}
        </Button>
      </div>
    </div>
  );
};

export default StepThree;