"use client";
import { useState } from "react";

export default function CompanyInfoSection({ data, onUpdate, editMode }) {
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
      <h2 className="text-xl font-semibold mb-6">Company Information</h2>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Select size</option>
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="201-500 employees">201-500 employees</option>
                <option value="501-1000 employees">501-1000 employees</option>
                <option value="1001-5000 employees">1001-5000 employees</option>
                <option value="5000+ employees">5000+ employees</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
              <input
                type="text"
                name="founded"
                value={formData.founded}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
              <input
                type="text"
                name="hqLocation"
                value={formData.hqLocation}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
              <input
                type="text"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setFormData(data)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
              <p className="mt-1 text-sm">{data.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Industry</h3>
              <p className="mt-1 text-sm">{data.industry}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Size</h3>
              <p className="mt-1 text-sm">{data.size}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Founded</h3>
              <p className="mt-1 text-sm">{data.founded}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-sm">{data.location}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Headquarters</h3>
              <p className="mt-1 text-sm">{data.hqLocation}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Specialties</h3>
              <p className="mt-1 text-sm">{data.specialties}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}