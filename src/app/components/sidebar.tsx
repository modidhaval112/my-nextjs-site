"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-md border-r border-gray-300 p-4">
        <Link href="/" className="p-2 hover:bg-gray-200 rounded">
          My App
        </Link>
        {/* Home Button */}
        <Link
          href="/citizenship-test"
          className="block p-3 text-lg font-bold text-blue-600 hover:bg-gray-100 rounded"
        >
          Home
        </Link>

        {/* Light Grey Separator */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Main Section */}
        <h3 className="text-gray-700 font-semibold mb-2">Main</h3>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/citizenship-test/practice"
            className="p-2 hover:bg-gray-200 rounded"
          >
            Practice
          </Link>
          <Link
            href="/citizenship-test/review"
            className="p-2 hover:bg-gray-200 rounded"
          >
            Review
          </Link>
          <Link
            href="/citizenship-test/study"
            className="p-2 hover:bg-gray-200 rounded"
          >
            Study
          </Link>
          <Link
            href="/citizenship-test/simulation"
            className="p-2 hover:bg-gray-200 rounded"
          >
            Simulation
          </Link>
        </nav>

        {/* Light Grey Separator */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* More Section */}
        <h3 className="text-gray-700 font-semibold mb-2">More</h3>
        <nav className="flex flex-col space-y-2">
          <Link
            href="/citizenship-test/change-log"
            className="p-2 hover:bg-gray-200 rounded"
          >
            Change Log
          </Link>
          <button
            onClick={() => setShowPopup(true)}
            className="p-2 text-left hover:bg-gray-200 rounded"
          >
            Support
          </button>
        </nav>
      </aside>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>
            {/* Support Content */}
            <p className="text-center">
              Please send any questions or feedback to <br />
              <strong>support@domain.ca</strong>. <br />
              Thanks for your support!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
