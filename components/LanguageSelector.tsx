import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <div>
      <p className="text-lg font-semibold text-slate-300 mb-2">Source Language</p>
      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(Language) as Array<keyof typeof Language>).map((langKey) => (
          <div key={langKey}>
            <input
              type="radio"
              id={Language[langKey]}
              name="language"
              value={Language[langKey]}
              checked={selectedLanguage === Language[langKey]}
              onChange={() => onLanguageChange(Language[langKey])}
              className="hidden"
            />
            <label
              htmlFor={Language[langKey]}
              className={`block w-full text-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 border-2 
                ${selectedLanguage === Language[langKey]
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 border-sky-400 text-white font-bold shadow-lg shadow-sky-500/20'
                  : 'bg-black/30 border-slate-600 hover:bg-slate-700/50 hover:border-slate-400'
                }`}
            >
              {Language[langKey]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;