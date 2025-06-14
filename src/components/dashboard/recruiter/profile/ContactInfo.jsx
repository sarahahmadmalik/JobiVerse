"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function ContactInfoSection({ data, onUpdate, editMode }) {
  const [formData, setFormData] = useState({
    primaryEmail: data.primaryEmail || '',
    phone: data.phone || '',
    address: data.address || '',
    hrEmail: data.hrEmail || '',
    generalEmail: data.generalEmail || '',
    location: data.location || ''
  });

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
              <Input
                label="Primary Email"
                type="email"
                name="primaryEmail"
                value={formData.primaryEmail}
                onChange={handleChange}
                placeholder="contact@company.com"
                required
              />
            </div>
            
            <div>
              <Input
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (123) 456-7890"
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Office Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Business St, City, Country"
              />
            </div>
            
            <div>
              <Input
                label="HR Department Email"
                type="email"
                name="hrEmail"
                value={formData.hrEmail}
                onChange={handleChange}
                placeholder="hr@company.com"
              />
            </div>
            
            <div>
              <Input
                label="General Inquiries Email"
                type="email"
                name="generalEmail"
                value={formData.generalEmail}
                onChange={handleChange}
                placeholder="info@company.com"
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Location (City, Country)"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="San Francisco, USA"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Primary Email</h3>
              <p className="mt-1 text-sm text-gray-900">
                {data.primaryEmail ? (
                  <a href={`mailto:${data.primaryEmail}`} className="text-blue-600 hover:underline">
                    {data.primaryEmail}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-sm text-gray-900">
                {data.phone ? (
                  <a href={`tel:${data.phone.replace(/[^0-9+]/g, '')}`} className="text-blue-600 hover:underline">
                    {data.phone}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Office Address</h3>
              <p className="mt-1 text-sm text-gray-900">{data.address || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">HR Department</h3>
              <p className="mt-1 text-sm text-gray-900">
                {data.hrEmail ? (
                  <a href={`mailto:${data.hrEmail}`} className="text-blue-600 hover:underline">
                    {data.hrEmail}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">General Inquiries</h3>
              <p className="mt-1 text-sm text-gray-900">
                {data.generalEmail ? (
                  <a href={`mailto:${data.generalEmail}`} className="text-blue-600 hover:underline">
                    {data.generalEmail}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>

            {/* <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-sm text-gray-900">{data.location || 'Not specified'}</p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}