"use client";
import { useState } from "react";
import ProfileSection from "@/components/dashboard/candidate/settings/ProfileSection";
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
  });

  const [notifications, setNotifications] = useState({
    all: true,
    jobAlerts: true,
    applicationUpdates: true,
    recruiterMessages: true,
    newsletterAndTips: true,
  });

  // Update user data handler
  const updateUserData = (key, value) => {
    setUserData({
      userData,
      [key]: value,
    });
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
      setNotifications({
        notifications,
        [key]: !notifications[key],
        all: !notifications[key]
          ? false
          : notifications.jobAlerts &&
            notifications.applicationUpdates &&
            notifications.recruiterMessages &&
            notifications.newsletterAndTips,
      });
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
      updateUserData("employmentTypes", [userData.employmentTypes, type]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-1">Settings</h1>
      <p className="text-gray-500 text-center text-sm mb-6">
        Manage your account preferences and customize your experience.
      </p>

      <div className="border rounded-lg shadow-sm">
        <ProfileSection userData={userData} updateUserData={updateUserData} />
        <AccountSection userData={userData} updateUserData={updateUserData} />
        <NotificationSection
          notifications={notifications}
          handleNotificationToggle={handleNotificationToggle}
        />
        <JobPreferencesSection
          userData={userData}
          updateUserData={updateUserData}
          handleEmploymentTypeToggle={handleEmploymentTypeToggle}
        />
      </div>
    </div>
  );
}
