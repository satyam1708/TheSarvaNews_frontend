import React from "react";

export default function TheSarvaNewsHeader() {
  return (
    <header className="flex justify-center bg-white py-4 border-b">
      <div className="flex items-center space-x-3 max-w-max px-4">
        {/* Professional flat icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-orange-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z" />
        </svg>

        {/* Business-styled heading */}
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          TheSarvaNews
        </h1>
      </div>
    </header>
  );
}
