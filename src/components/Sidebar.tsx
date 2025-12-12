import React, { type JSX } from "react";
import { useLocation, Link } from "react-router-dom";
import { GLOBE_ICON, MAP_ICON, GALLERY_ICON, HOME_ICON } from "./Icons";

interface SidebarItem {
  path: string;
  label: string;
  icon: JSX.Element;
}

const sidebarItems: SidebarItem[] = [
  {
    path: "/",
    label: "Home",
    icon: HOME_ICON,
  },
  {
    path: "/gallery",
    label: "Gallery",
    icon: GALLERY_ICON,
  },
  {
    path: "/map",
    label: "Map",
    icon: MAP_ICON,
  },
  {
    path: "/360",
    label: "360 Images",
    icon: GLOBE_ICON,
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
          {drawerOpen ? (
            <div className="w-full flex items-center justify-between h-full">
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={`${import.meta.env.BASE_URL}tiger_long.png`}
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
                src={`${import.meta.env.BASE_URL}tiger_sm.png`}
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
