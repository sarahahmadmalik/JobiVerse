"use client";
import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import clsx from "clsx";

export default function BrandingSection({ data, onUpdate, editMode }) {
  const [formData, setFormData] = useState({
    logo: data.logo || '',
    description: data.description || '',
    website: data.website || '',
    linkedin: data.linkedin || '',
    twitter: data.twitter || '',
    facebook: data.facebook || '',
    instagram: data.instagram || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [e.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Company Branding</h2>
      
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input
                label="Company Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                as="textarea"
                rows={4}
                placeholder="Describe your company's mission and values"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
              <div className={clsx(
                "w-full px-4 py-3 border border-gray-300 rounded-[12px]",
                "hover:border-gray-400 transition-all duration-200 ease-in-out"
              )}>
                <input
                  type="file"
                  name="logo"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full text-sm text-gray-500"
                />
              </div>
              {formData.logo && (
                <div className="mt-2">
                  <img src={formData.logo} alt="Logo preview" className="h-20 object-contain" />
                </div>
              )}
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Website"
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            
            <div>
              <Input
                label="LinkedIn"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="company-name"
                prefix="linkedin.com/company/"
              />
            </div>
            
            <div>
              <Input
                label="Twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="username"
                prefix="twitter.com/"
              />
            </div>

            <div>
              <Input
                label="Facebook"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="username"
                prefix="facebook.com/"
              />
            </div>

            <div>
              <Input
                label="Instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="username"
                prefix="instagram.com/"
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
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Company Description</h3>
            <p className="mt-1 text-sm text-gray-900">{data.description || 'Not specified'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Company Logo</h3>
            {data.logo ? (
              <img src={data.logo} alt="Company logo" className="h-20 mt-2 object-contain" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center mt-2">
                <span className="text-gray-400">No logo</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Website</h3>
              <p className="mt-1 text-sm">
                {data.website ? (
                  <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {data.website}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">LinkedIn</h3>
              <p className="mt-1 text-sm">
                {data.linkedin ? (
                  <a 
                    href={`https://linkedin.com/company/${data.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    linkedin.com/company/{data.linkedin}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Twitter</h3>
              <p className="mt-1 text-sm">
                {data.twitter ? (
                  <a 
                    href={`https://twitter.com/${data.twitter}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    twitter.com/{data.twitter}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Facebook</h3>
              <p className="mt-1 text-sm">
                {data.facebook ? (
                  <a 
                    href={`https://facebook.com/${data.facebook}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    facebook.com/{data.facebook}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Instagram</h3>
              <p className="mt-1 text-sm">
                {data.instagram ? (
                  <a 
                    href={`https://instagram.com/${data.instagram}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    instagram.com/{data.instagram}
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