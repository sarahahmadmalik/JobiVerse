"use client"
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";

export default function PersonalInfoSection({ data, onUpdate, editMode }) {

    
    const [formData, setFormData] = useState({
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Combine first and last names before updating
        onUpdate({
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`.trim()
        });
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
                            label="First Name"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="!px-3"
                        />
                        <Input
                            label="Last Name"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
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
                </div>
            )}
        </div>
    );
}