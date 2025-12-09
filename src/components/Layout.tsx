import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

export const Layout: React.FC = () => {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    // Example: fake initial load; replace with real init/fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      <div className="flex-1 flex flex-col">
        <Header drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

        <main ref={mainContainerRef} className="flex-1 overflow-y-auto">
          <div className="border-t border-gray-700 p-6 h-full">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                {/* Your loading screen / spinner */}
                <div className="flex flex-col items-center gap-4">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-500 border-t-transparent" />
                  <p className="text-gray-300">Loading…</p>
                </div>
              </div>
            ) : (
              <Outlet context={{ mainContainerRef }} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
