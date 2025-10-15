import React from 'react';

const DocumentIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto text-center">
      <div className="flex justify-center items-center gap-4">
        <div className="bg-sky-500/10 rounded-full p-3 ring-1 ring-sky-500/20">
            <DocumentIcon />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent tracking-tight">
          Polyglot Vision
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
        Upload an image or PDF, or take a photo with your camera. Our AI will extract and translate it into English in seconds.
      </p>
    </header>
  );
};

export default Header;