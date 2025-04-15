"use client";
import { useState, useRef } from 'react';
import Button from '@/components/ui/button';
import Image from 'next/image';
import { FaUserCircle, FaPencilAlt, FaTimes } from 'react-icons/fa';

export default function ProfileHeader({ user, isCandidate, editMode, toggleEditMode, onImageUpload }) {
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                onImageUpload(file); // Pass the file to parent component for upload
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setPreviewImage(null);
        onImageUpload(null); // Notify parent to remove the image
    };

    return (
        <div className="relative bg-white shadow-sm">
            <div className="h-48 rounded-t-[16px] bg-gradient-to-r from-colors-primary to-purple-300 w-full" />

            {/* Profile Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-end relative -top-16 md:-top-20">
                    {/* Avatar with upload functionality */}
                    <div className="relative mb-4 md:mb-0 group">
                        <div className="h-32 w-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden relative">
                            {previewImage ? (
                                <>
                                    <Image
                                        src={previewImage}
                                        alt="Profile preview"
                                        width={128}
                                        height={128}
                                        className="object-cover w-full h-full"
                                    />
                                    {editMode && (
                                        <button
                                            onClick={removeImage}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            aria-label="Remove profile picture"
                                        >
                                            <FaTimes className="h-3 w-3" />
                                        </button>
                                    )}
                                </>
                            ) : user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    alt="Profile"
                                    width={128}
                                    height={128}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <FaUserCircle className="text-gray-400 text-[8rem] w-full h-full" />
                            )}
                        </div>
                        {editMode && (
                            <>
                                <button
                                    onClick={triggerFileInput}
                                    className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-sm hover:bg-blue-600 transition-colors"
                                    aria-label="Edit profile picture"
                                >
                                    <FaPencilAlt className="h-4 w-4" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </>
                        )}
                    </div>

                    {/* Rest of the profile info remains the same */}
                    <div className="md:ml-8 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-lg text-gray-600">{user.title}</p>
                                {isCandidate && user.jobPreferences?.seeking && (
                                    <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        Open to work
                                    </span>
                                )}
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Button
                                    onClick={toggleEditMode}
                                    className={`!text-[15px] !shadow-none py-2 rounded-md font-medium flex items-center gap-2 ${
                                        editMode
                                            ? '!bg-gray-200 !text-gray-800 hover:bg-gray-300'
                                            : ''
                                    } transition-colors`}
                                >
                                    {editMode ? (
                                        'Cancel'
                                    ) : (
                                        <>
                                            <FaPencilAlt className="h-3 w-3" />
                                            <span>Edit Profile</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                            {user.location && (
                                <div className="flex items-center">
                                    <span>{user.location}</span>
                                </div>
                            )}
                            {user.email && (
                                <div className="flex items-center">
                                    <span>{user.email}</span>
                                </div>
                            )}
                            {user.phone && (
                                <div className="flex items-center">
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            {!isCandidate && user.company && (
                                <div className="flex items-center">
                                    <span>{user.company}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}