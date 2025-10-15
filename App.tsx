import React, { useState, useCallback } from 'react';
import { Language } from './types';
import { extractAndTranslateText } from './services/geminiService';
import Header from './components/Header';
import InputMethod from './components/InputMethod';
import LanguageSelector from './components/LanguageSelector';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState<Language>(Language.NEPALI);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const [extractedText, setExtractedText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isResultsViewActive, setIsResultsViewActive] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setExtractedText('');
    setTranslatedText('');
    setError(null);
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setImageUrl(null); 
      }
    } else {
      setImageUrl(null);
    }
  };

  const handleTranslate = useCallback(async () => {
    if (!file) {
      setError('Please select a file or capture a photo first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');
    setTranslatedText('');

    const reader = new FileReader();

    try {
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        if (!event.target?.result) {
          setError('Failed to read the file.');
          setIsLoading(false);
          return;
        }
        
        const base64Data = (event.target.result as string).split(',')[1];
        
        try {
            const result = await extractAndTranslateText(base64Data, file.type, sourceLanguage);
            setExtractedText(result.originalText);
            setTranslatedText(result.translatedText);
            setIsResultsViewActive(true); // Switch to results view on success
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setIsResultsViewActive(true); // Still switch to view to show the error
        } finally {
            setIsLoading(false);
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setIsLoading(false);
        setIsResultsViewActive(true); // Switch to view to show the error
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setIsLoading(false);
      setIsResultsViewActive(true); // Switch to view to show the error
    }
  }, [file, sourceLanguage]);

  const handleGoBack = useCallback(() => {
    setIsResultsViewActive(false);
  }, []);

  return (
    <div className="min-h-screen text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-['Inter',_sans-serif]">
      <div className={`${isResultsViewActive ? 'hidden lg:block' : 'block'}`}>
        <Header />
      </div>

      <main className="w-full max-w-7xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* INPUT PANEL */}
        <div className={`${isResultsViewActive ? 'hidden lg:flex' : 'flex'} flex-col`}>
          <div className="bg-slate-900/60 p-6 rounded-2xl shadow-2xl ring-1 ring-white/20 backdrop-blur-lg flex flex-col space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent">1. Select Your Input</h2>
            <InputMethod onFileChange={handleFileChange} />
            <LanguageSelector selectedLanguage={sourceLanguage} onLanguageChange={setSourceLanguage} />
            <button
              onClick={handleTranslate}
              disabled={!file || isLoading}
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50 disabled:shadow-none"
            >
              {isLoading ? 'Processing...' : 'Extract & Translate'}
            </button>
          </div>
        </div>

        {/* RESULTS PANEL */}
        <div className={`${isResultsViewActive ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-slate-900/60 p-6 rounded-2xl shadow-2xl ring-1 ring-white/20 backdrop-blur-lg min-h-[500px]">
             <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent mb-4">2. View Results</h2>
             {isLoading && <Spinner />}
             
             {!isLoading && (
              <ResultsDisplay
                imageUrl={imageUrl}
                originalText={extractedText}
                translatedText={translatedText}
                sourceLanguage={sourceLanguage}
                onGoBack={handleGoBack}
                isResultsViewActive={isResultsViewActive}
                error={error}
              />
             )}
          </div>
        </div>
      </main>

      <footer className={`w-full max-w-7xl mx-auto mt-12 text-center text-slate-500 text-sm ${isResultsViewActive ? 'hidden lg:block' : 'block'}`}>
        <p>&copy; 2024 Polyglot Vision. Powered by AI to bridge language barriers.</p>
      </footer>
    </div>
  );
};

export default App;