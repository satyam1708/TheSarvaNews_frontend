import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-4 mt-auto w-full">
      <div className="container mx-auto px-4 text-center text-sm flex flex-col md:flex-row justify-center items-center gap-2">
        <span>© {new Date().getFullYear()} TheSarvaNews. All rights reserved.</span>
      </div>
    </footer>
  );
}
