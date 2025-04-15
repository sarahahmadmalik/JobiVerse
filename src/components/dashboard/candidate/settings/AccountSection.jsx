import { useState } from "react";
import Input from "@/components/ui/Input"; // Adjust the import path as needed

export default function AccountSection({ userData, updateUserData }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handlePasswordChangeClick = () => {
    setShowPasswordForm(!showPasswordForm);
    // Reset form when closing
    if (showPasswordForm) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmitPasswordChange = (e) => {
    e.preventDefault();
    
    // Validate form
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    };

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    // Here you would typically call an API to change the password
    console.log("Password change submitted", passwordData);

    // Reset form after submission
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setShowPasswordForm(false);

    // Show success message
    alert("Password changed successfully!");
  };

  return (
    <div className="flex border-b">
      <div className="w-1/4 bg-gray-50 p-6 font-medium">
        Account Settings
      </div>
      <div className="w-3/4 p-6">
        <div className="mb-4">
          <div 
            className="flex justify-between items-center mb-6 cursor-pointer"
            onClick={handlePasswordChangeClick}
          >
            <p className="text-gray-600">Change Password</p>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 text-gray-400 transition-transform ${showPasswordForm ? 'rotate-90' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleSubmitPasswordChange} className="mb-6">
              <div className="grid grid-cols-1 gap-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  className={errors.currentPassword ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-[-8px]">{errors.currentPassword}</p>
                )}
                
                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  className={errors.newPassword ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-[-8px]">{errors.newPassword}</p>
                )}
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className={errors.confirmPassword ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-[-8px]">{errors.confirmPassword}</p>
                )}
                
                <div className="flex space-x-4 mt-2">
                  <button 
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-[12px] hover:bg-indigo-700 transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordChangeClick}
                    className="bg-white text-gray-600 border border-gray-300 px-4 py-2 rounded-[12px] hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
          
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Current Plan</p>
            <p>{userData.plan}</p>
          </div>
          
          <div className="flex space-x-4 mt-4">
            <button className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-[12px] hover:bg-indigo-50 transition-all">
              Change Plan
            </button>
            <button className="bg-white text-red-600 border border-red-600 px-4 py-2 rounded-[12px] hover:bg-red-50 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}