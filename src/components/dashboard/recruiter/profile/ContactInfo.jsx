"use client";
import { useState } from "react";

export default function ContactInfoSection({ data, onUpdate, editMode }) {
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
      <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Email</label>
              <input
                type="email"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">HR Email</label>
              <input
                type="email"
                name="hrEmail"
                value={formData.hrEmail}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">General Email</label>
              <input
                type="email"
                name="generalEmail"
                value={formData.generalEmail}
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
              <h3 className="text-sm font-medium text-gray-500">Primary Email</h3>
              <p className="mt-1 text-sm">
                <a href={`mailto:${data.primaryEmail}`} className="text-blue-600 hover:underline">
                  {data.primaryEmail}
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-sm">
                {data.phone ? (
                  <a href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`} className="text-blue-600 hover:underline">
                    {data.phone}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 text-sm">{data.address || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">HR Email</h3>
              <p className="mt-1 text-sm">
                {data.hrEmail ? (
                  <a href={`mailto:${data.hrEmail}`} className="text-blue-600 hover:underline">
                    {data.hrEmail}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">General Email</h3>
              <p className="mt-1 text-sm">
                {data.generalEmail ? (
                  <a href={`mailto:${data.generalEmail}`} className="text-blue-600 hover:underline">
                    {data.generalEmail}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}