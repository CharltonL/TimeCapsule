import React, { type JSX } from "react";
import { useLocation, Link } from "react-router-dom";

interface SidebarItem {
  path: string;
  label: string;
  icon: JSX.Element;
}

const sidebarItems: SidebarItem[] = [
  {
    path: "/",
    label: "Home",
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    path: "/orders",
    label: "Orders",
    icon: (
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    path: "/foodItems",
    label: "Food Items",
    icon: <>text</>,
  },
  {
    path: "/categories",
    label: "Categories",
    icon: (
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
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
  },
  {
    path: "/locations",
    label: "Locations",
    icon: (
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
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    path: "/accounts",
    label: "Accounts",
    icon: (
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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
  {
    path: "/billing",
    label: "Billing",
    icon: (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

interface SidebarProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  drawerOpen,
  toggleDrawer,
}) => {
  const { pathname } = useLocation();

  const isSelected = (itemPath: string) => {
    if (itemPath === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <aside
      className={`h-full  text-white transition-all duration-300 ease-in-out z-40 overflow-hidden border-r border-gray-700 ${
        drawerOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center justify-between  h-16 `}>
          {/* <div
          className={`flex items-center justify-between ${
            drawerOpen ? "p-4" : "p-0"
          } border-b border-gray-700 h-16 overflow-hidden`}
        > */}
          {drawerOpen ? (
            <div className="w-full flex items-center justify-between h-full">
              {/* <h2 className="text-lg font-semibold bg-red-500">Menu</h2> */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/tiger_long.png"
                  alt="Logo Long"
                  className="h-full w-auto bg-none"
                />
              </div>
              <button
                onClick={toggleDrawer}
                className="hover:bg-gray-700 transition-colors m-4 p-2 rounded-lg opacity-50"
                aria-label="Close sidebar"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src="/tiger_sm.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 border-t border-gray-700">
          <ul className="space-y-1">
            {sidebarItems.map((item, i) => (
              <li key={i}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 transition-colors ${
                    isSelected(item.path)
                      ? "bg-gray-700 text-white border-l-4 border-blue-500"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } ${!drawerOpen ? "justify-center" : ""}`}
                >
                  <span className={`shrink-0 ${drawerOpen ? "mr-3" : ""}`}>
                    {item.icon}
                  </span>
                  {drawerOpen && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-gray-700 p-4">
          {drawerOpen ? (
            <div className="text-xs text-gray-400 text-center">v1.0.0</div>
          ) : (
            <div className="text-xs text-gray-400 text-center">v1</div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
