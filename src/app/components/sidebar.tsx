"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PanelLeft,
  Home,
  Pencil,
  Search,
  BookOpen,
  Monitor,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full ${
        collapsed ? "w-16" : "w-64"
      } bg-white shadow-md border-r border-gray-300 p-4 transition-all duration-300`}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="flex items-center justify-between">
        {/* Always display logo in collapsed or expanded state */}
        <div className="flex items-center space-x-2">
          <img src="/logo.webp" alt="Logo" className="w-8 h-8" />
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">BeCitizen</h1>
              <p className="text-sm text-gray-500">
                Canadian Citizenship Test 2025
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-900 p-2"
        >
          <PanelLeft size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 space-y-2">
        <Link
          href="/citizenship-test"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <Home size={20} />
          {!collapsed && <span>Home</span>}
        </Link>

        <h3
          className={`text-gray-700 font-semibold ${
            collapsed ? "hidden" : "mt-4 mb-2"
          }`}
        >
          Main
        </h3>

        <Link
          href="/citizenship-test/practice"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <Pencil size={20} />
          {!collapsed && <span>Practice</span>}
        </Link>

        <Link
          href="/citizenship-test/review"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <Search size={20} />
          {!collapsed && <span>Review</span>}
        </Link>

        <Link
          href="/citizenship-test/study"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <BookOpen size={20} />
          {!collapsed && <span>Study</span>}
        </Link>

        <Link
          href="/citizenship-test/simulation"
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100"
        >
          <Monitor size={20} />
          {!collapsed && <span>Simulation</span>}
        </Link>
      </nav>
    </aside>
  );
}
