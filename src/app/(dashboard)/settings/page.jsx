"use client";
import { useState } from "react";
import AccountSection from "@/components/dashboard/candidate/settings/AccountSection";
import NotificationSection from "@/components/dashboard/candidate/settings/NotificationSection";
import JobPreferencesSection from "@/components/dashboard/candidate/settings/JobPreferenceSection";

export default function Settings() {
  const [userData, setUserData] = useState({
    name: "Areeba Nazim",
    email: "areeba@gmail.com",
    phone: "+1219168192",
    plan: "Free",
    availability: "",
    location: "",
    industry: "",
    employmentTypes: ["Part Time"],
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    all: true,
    jobAlerts: true,
    applicationUpdates: true,
    recruiterMessages: true,
    newsletterAndTips: true,
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Update user data handler
  const updateUserData = (key, value) => {
    setUserData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle password change
  const handlePasswordChange = () => {
    // Reset errors
    setPasswordErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Validation
    let isValid = true;
    const newErrors = {};

    if (!userData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!userData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (userData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (userData.newPassword !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!isValid) {
      setPasswordErrors(newErrors);
      return;
    }

    // Here you would typically call an API to change the password
    console.log("Password change submitted", {
      currentPassword: userData.currentPassword,
      newPassword: userData.newPassword
    });

    // Reset password fields after submission
    setUserData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    // Show success message (you might want to use a toast or alert)
    alert("Password changed successfully!");
  };

  // Handle notification toggle
  const handleNotificationToggle = (key) => {
    if (key === "all") {
      const newValue = !notifications.all;
      setNotifications({
        all: newValue,
        jobAlerts: newValue,
        applicationUpdates: newValue,
        recruiterMessages: newValue,
        newsletterAndTips: newValue,
      });
    } else {
      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key],
        all: !prev[key]
          ? false
          : prev.jobAlerts &&
            prev.applicationUpdates &&
            prev.recruiterMessages &&
            prev.newsletterAndTips,
      }));
    }
  };

  // Handle employment type toggle
  const handleEmploymentTypeToggle = (type) => {
    if (userData.employmentTypes.includes(type)) {
      updateUserData(
        "employmentTypes",
        userData.employmentTypes.filter((t) => t !== type)
      );
    } else {
      updateUserData("employmentTypes", [...userData.employmentTypes, type]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-1">Settings</h1>
      <p className="text-gray-500 text-center text-sm mb-6">
        Manage your account preferences and customize your experience.
      </p>

      <div className="border rounded-lg overflow-hidden shadow-sm">
        {/* Removed ProfileSection since you have it separately */}
        <AccountSection 
          userData={userData} 
          updateUserData={updateUserData}
          passwordErrors={passwordErrors}
          handlePasswordChange={handlePasswordChange}
        />
        <NotificationSection
          notifications={notifications}
          handleNotificationToggle={handleNotificationToggle}
        />
        {/* <JobPreferencesSection
          userData={userData}
          updateUserData={updateUserData}
          handleEmploymentTypeToggle={handleEmploymentTypeToggle}
        /> */}
      </div>
    </div>
  );
}