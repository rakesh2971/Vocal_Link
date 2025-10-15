import React, { useState } from 'react';
import { Language } from '../types';

interface ResultsDisplayProps {
  imageUrl: string | null;
  originalText: string;
  translatedText: string;
  sourceLanguage: Language;
  onGoBack: () => void;
  isResultsViewActive: boolean;
  error: string | null;
}

const ClipboardIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const BackArrowIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);


const ResultCard: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!content || isCopied) return;
        navigator.clipboard.writeText(content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => console.error("Failed to copy:", err));
    };
    
    return (
        <div className="relative">
            <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
            <textarea
                readOnly
                value={content}
                className="w-full h-48 p-3 bg-black/40 border border-slate-600 rounded-lg text-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none resize-none"
                placeholder="Result will appear here..."
            />
            {content && (
                <button
                    onClick={handleCopy}
                    className="absolute top-10 right-3 p-2 rounded-md bg-slate-700/50 hover:bg-slate-600/70 text-slate-400 hover:text-white transition-all duration-200"
                    aria-label="Copy to clipboard"
                >
                    {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                </button>
            )}
        </div>
    );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ imageUrl, originalText, translatedText, sourceLanguage, onGoBack, isResultsViewActive, error }) => {
  const hasResults = originalText || translatedText;
  const showContent = !error && (imageUrl || hasResults);
  
  if (!showContent && !error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-8 border-2 border-dashed border-slate-700 rounded-xl bg-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
            </svg>
            <p className="text-lg font-medium">Your translation results will be displayed here.</p>
            <p className="text-sm mt-1">Upload a document and click translate to begin.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
        {isResultsViewActive && (
             <button 
                onClick={onGoBack}
                className="lg:hidden flex items-center gap-2 text-slate-300 hover:text-sky-400 transition-colors -mb-2 font-semibold"
            >
                <BackArrowIcon />
                Back to Home
            </button>
        )}

        {error && <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">{error}</div>}

        {showContent && (
            <>
                {imageUrl && (
                    <div className="animate-fade-in-up">
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">Image Preview</h3>
                        <img src={imageUrl} alt="Uploaded document" className="rounded-lg max-h-60 w-auto object-contain border border-slate-700 shadow-lg shadow-black/30" />
                    </div>
                )}
              
                {hasResults && (
                    <>
                        <div className="animate-fade-in-up" style={{ animationDelay: imageUrl ? '200ms' : '0ms' }}>
                            <ResultCard title="Translated Text (English)" content={translatedText} />
                        </div>
                        <div className="animate-fade-in-up" style={{ animationDelay: imageUrl ? '400ms' : '200ms' }}>
                            <ResultCard title={`Original Text (${sourceLanguage})`} content={originalText} />
                        </div>
                    </>
                )}
            </>
        )}
    </div>
  );
};

export default ResultsDisplay;