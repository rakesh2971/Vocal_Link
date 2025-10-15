import React from 'react';
import './Spinner.css';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-8">
      <div className="spinner-container">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="text-slate-400 text-lg">AI is performing its magic...</p>
    </div>
  );
};

// We will inject the CSS directly into the document head
// to avoid needing a separate CSS file for this component.
const styles = `
.spinner-container {
  width: 80px;
  height: 80px;
  position: relative;
}
.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid transparent;
  animation: spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.spinner-ring:nth-child(1) {
  border-top-color: #38bdf8; /* sky-400 */
  animation-delay: -0.45s;
}
.spinner-ring:nth-child(2) {
  border-right-color: #22d3ee; /* cyan-400 */
  animation-delay: -0.3s;
}
.spinner-ring:nth-child(3) {
  border-bottom-color: #67e8f9; /* cyan-300 */
  animation-delay: -0.15s;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default Spinner;
