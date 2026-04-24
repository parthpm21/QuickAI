import React from "react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 bg-white pt-10">
      
      <svg
        className="hidden md:block absolute -bottom-30 -left-80 opacity-5 w-full h-full pointer-events-none"
        width="68"
        height="26"
        viewBox="0 0 68 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0)">
          <path d="M16.141 0C13.4854 0 10.9387 1.04871 9.06091 2.91543L2.93268 9.00761C1.05492 10.8743 0 13.4061 0 16.0461C0 21.5435 4.48289 26 10.0128 26C12.6684 26 15.2152 24.9512 17.0929 23.0845L33.6827 6.59239C34.5795 5.70086 35.7958 5.2 37.0641 5.2C39.1874 5.2 40.9876 6.57576 41.6117 8.47953L45.5096 4.60457C43.7314 1.83589 40.6134 0 37.0641 0Z" fill="#364153"/>
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="68" height="26" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14">
        
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-100">
              Q
            </div>
            <p className="font-bold text-2xl text-gray-900 tracking-tight">Quick<span className="text-indigo-600">.ai</span></p>
          </div>
          <p className="text-sm leading-7 text-gray-500 max-w-xs">
            Unlock the power of Artificial Intelligence to generate stunning articles, 
            blog titles, and perfect resumes in seconds.
          </p>
        </div>

        <div className="flex flex-col lg:items-center">
          <div className="flex flex-col text-sm space-y-2.5">
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <a className="hover:text-slate-600" href="#">About us</a>
            <a className="hover:text-slate-600" href="#">Careers</a>
            <a className="hover:text-slate-600" href="#">Contact us</a>
            <a className="hover:text-slate-600" href="#">Privacy policy</a>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-5">
            Subscribe to our newsletter
          </h2>
          <div className="text-sm space-y-6 max-w-sm">
            <p>The latest news, articles, and resources, sent weekly.</p>
            <div className="flex items-center">
              <input
                className="rounded-l-md bg-gray-100 outline-none w-full max-w-64 h-11 px-3"
                type="email"
                placeholder="Enter your email"
              />
              <button className="bg-indigo-600 hover:bg-indigo-700 transition px-4 h-11 text-white rounded-r-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t mt-12 border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            Q
          </div>
          <p className="font-medium text-gray-900">
            © 2025 <span className="text-indigo-600 font-semibold">Quick.ai</span>. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Crafted with Passion</p>
          <div className="flex items-center gap-2 group cursor-default">
            <span className="text-gray-600">Made with</span>
            <span className="text-red-500 animate-pulse text-lg">❤️</span>
            <span className="text-gray-600">by</span>
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:to-indigo-600 transition-all duration-500 text-base">
              Parth
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-500 font-medium">
          <a href="/" className="hover:text-indigo-600 transition-colors">Privacy</a>
          <a href="/" className="hover:text-indigo-600 transition-colors">Terms</a>
          <a href="/" className="hover:text-indigo-600 transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
