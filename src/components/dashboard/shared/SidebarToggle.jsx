import { useState } from "react";

export default function SidebarToggle({ collapsed, toggleSidebar }) {
  return (
    <button
      onClick={toggleSidebar}
      className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md"
    >
      {collapsed ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
