"use client"
import { useState } from "react";
import Input from "@/components/ui/input"; // Adjust the import path as needed
import Button from "@/components/ui/button";

export default function PersonalInfoSection({ data, onUpdate, editMode }) {
    const [formData, setFormData] = useState(data);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onUpdate(formData);
    };
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>
  
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="!px-3"
              />
              <Input
                label="Professional Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="!px-3"
              />
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="!px-3"
              />
              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="!px-3"
              />
              <Input
                label="Location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="!px-3"
              />
              <div className="md:col-span-2">
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none px-3 py-[12px] border border-gray-300 rounded-[12px] text-gray-800 placeholder-gray-400 
                               focus:outline-none focus:ring-1 focus:ring-colors-primary focus:border-colors-primary 
                               hover:border-gray-400 transition-all duration-200 ease-in-out"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                className="px-4 py-2 !shadow-none !text-[15px]"
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{data.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-medium">{data.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{data.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{data.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{data.location}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bio</p>
              <p className="font-medium">{data.bio}</p>
            </div>
          </div>
        )}
      </div>
    );
}