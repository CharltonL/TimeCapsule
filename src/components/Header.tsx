import React from "react";

interface HeaderProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ drawerOpen, toggleDrawer }) => {
  return (
    <header className="text-white h-16 shadow-md relative z-50 flex items-center px-4 bg-[#1B211A] justify-center">
      {!drawerOpen && (
        <button
          onClick={toggleDrawer}
          className="p-2 rounded-lg opacity-50 hover:bg-gray-700 transition-colors absolute left-4"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <h1 className={`text-xl font-semibold  ${!drawerOpen ? "ml-4" : ""}`}>
        RIT Time Capsule Fall 2025
      </h1>
    </header>
  );
};

export default Header;
