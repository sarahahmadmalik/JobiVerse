import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleMenuItemClick = (itemName) => {
    setActiveItem(itemName);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Updated menu items with paths
  const menuItems = [
    { name: "Home", icon: "/assets/dash_icons/home.svg", path: "/home" },
    {
      name: "Resume Builder",
      icon: "/assets/dash_icons/builder.svg",
      path: "/resume-builder",
    },
    {
      name: "Job Listings",
      icon: "/assets/dash_icons/listing.svg",
      path: "/job-listings",
    },
    {
      name: "Application Manager",
      icon: "/assets/dash_icons/application-manager.svg",
      path: "/application-manager",
    },
    {
      name: "Saved Jobs",
      icon: "/assets/dash_icons/saved-jobs.svg",
      path: "/saved-jobs",
    },
    {
      name: "Schedule",
      icon: "/assets/dash_icons/schedule.svg",
      path: "/schedule",
    },
    { name: "Chats", icon: "/assets/dash_icons/chats.svg", path: "/chats" },
  ];

  const generalItems = [
    {
      name: "Help & Support",
      icon: "/assets/dash_icons/help.svg",
      path: "/help-support",
    },
    {
      name: "Settings",
      icon: "/assets/dash_icons/settings.svg",
      path: "/settings",
    },
  ];

  return (
    <div
      className={`flex flex-col z-40 justify-between h-full lg:h-screen overflow-y-scroll transition-all duration-300 ${
        collapsed ? "w-20" : "w-[250px]"
      } sticky top-0`}
    >
      {/* Toggle Button */}
      <div
        className={`relative ${
          collapsed ? "w-20" : "w-64"
        } p-2 hidden md:block`}
      >
        <button
          onClick={toggleSidebar}
          className={`absolute ${
            !collapsed ? `left-[16px] top-[15px]` : `top-[10px] left-[25px]`
          } text-colors-primary bg-white border border-gray-300 rounded-full p-1 transition-transform hover:bg-gray-100`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 text-colors-primary transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-col">
        {/* Logo Section */}
        <div className="flex items-center justify-center py-6">
          {collapsed ? (
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 flex items-center justify-center">
                <Image
                  src="/logo-small.svg"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="text-white"
                />
              </div>
            </div>
          ) : (
            <Link href="/home" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Jobiverse Logo"
                width={180}
                height={50}
                priority
                className="block"
              />
            </Link>
          )}
        </div>

        {/* Main Menu Section */}
        <div className="px-3 py-2">
          {!collapsed && (
            <p className="text-[12px] font-[300] text-[#00000066] mb-2 pl-3">
              Main Menu
            </p>
          )}
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  onClick={() => handleMenuItemClick(item.name)}
                  className={`inline-flex items-center !text-[14px] font-[400] py-2 ${
                    collapsed
                      ? "justify-center !px-2 rounded-[12px]"
                      : "px-2 rounded-[12px] !flex"
                  } ${
                    item.name === activeItem
                      ? "bg-indigo-600 text-white"
                      : "text-colors-textPrimary hover:text-indigo-600"
                  }`}
                >
                  <span
                    className={`flex items-center w-8 h-8 justify-center ${
                      item.name === activeItem ? "bg-white rounded-[8px]" : ""
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                    />
                  </span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* General Section */}
        <div className="px-3 py-2">
          {!collapsed && (
            <p className="text-[12px] font-[300] text-[#00000066] mb-2 pl-3">
              General
            </p>
          )}
          <ul className="space-y-2">
            {generalItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  onClick={() => handleMenuItemClick(item.name)}
                  className={`flex items-center !text-[14px] font-[400] py-2 ${
                    collapsed
                      ? "!inline-flex justify-center px-2"
                      : "px-2 rounded-[12px]"
                  } ${
                    item.name === activeItem
                      ? "bg-indigo-600 text-white"
                      : "text-colors-textPrimary hover:text-indigo-600"
                  }`}
                >
                  <span
                    className={`flex items-center w-8 h-8 justify-center ${
                      item.name === activeItem ? "bg-white rounded-[8px]" : ""
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                    />
                  </span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Profile Section */}
      <div
        className={`border-t border-gray-100 mt-auto ${
          collapsed ? "p-3" : "p-4"
        }`}
      >
        <div
          className={`flex px-1 ${
            collapsed ? "justify-center" : "items-center"
          }`}
        >
          <div className="relative w-8 h-8">
            <Image
              src="/assets/review-user.svg"
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Areeba Nazim</p>
              <p className="text-xs text-gray-500">areeba@nazim.com</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Link
            href="/logout"
            className="flex items-center text-[14px] font-[400] mt-4 text-gray-500 hover:text-indigo-600 rounded-lg px-2 py-2"
          >
            <span className="inline-flex items-center justify-center w-6 h-6">
              <Image
                src="/assets/dash_icons/logout.svg"
                alt="Logout"
                width={24}
                height={24}
              />
            </span>
            <span className="ml-3">Logout</span>
          </Link>
        )}
        {collapsed && (
          <Link
            href="/logout"
            className="flex items-center justify-center mt-4 text-colors-textPrimary hover:text-indigo-600 rounded-lg p-2"
          >
            <span className="inline-flex items-center justify-center w-6 h-6">
              <Image
                src="/assets/dash_icons/logout.svg"
                alt="Logout"
                width={24}
                height={24}
              />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
