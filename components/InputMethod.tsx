import React, { useState, useCallback, useRef, useEffect } from 'react';

interface InputMethodProps {
  onFileChange: (file: File | null) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full py-2 text-sm font-bold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50
            ${active ? 'bg-sky-500/80 text-white' : 'bg-transparent text-slate-400 hover:bg-slate-700/50'}`}
    >
        {children}
    </button>
);


const InputMethod: React.FC<InputMethodProps> = ({ onFileChange }) => {
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');

  // State for Upload mode
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for Camera mode
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file) {
      setFileName(file.name);
      onFileChange(file);
    } else {
      setFileName(null);
      onFileChange(null);
    }
  }, [onFileChange]);

  const stopCamera = useCallback(() => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    // Cleanup function to stop the camera when the component unmounts
    return () => {
        stopCamera();
    };
  }, [stopCamera]);

  const startCamera = async () => {
    stopCamera();
    setCapturedImage(null);
    setCameraError(null);
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Could not access camera. Please ensure you have granted permission and are using a secure (HTTPS) connection.");
    }
  };

  const handleModeChange = (newMode: 'upload' | 'camera') => {
    setMode(newMode);
    handleFile(null);
    setCapturedImage(null);

    if (newMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };
  
  // Upload mode handlers
  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  // Camera mode handlers
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
    }
  };
  
  const usePhoto = async () => {
    if (capturedImage) {
        const blob = await (await fetch(capturedImage)).blob();
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        handleFile(file);
    }
  };

  const retakePhoto = () => {
    handleFile(null);
    setCapturedImage(null);
    startCamera();
  };

  return (
    <div>
        <div className="bg-slate-800/50 rounded-lg p-1 mb-4 flex space-x-1">
            <TabButton active={mode === 'upload'} onClick={() => handleModeChange('upload')}>Upload File</TabButton>
            <TabButton active={mode === 'camera'} onClick={() => handleModeChange('camera')}>Use Camera</TabButton>
        </div>
        
        {mode === 'upload' && (
             <label
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 transform
                    ${isDragging ? 'border-sky-400 bg-sky-900/40 scale-105 shadow-2xl shadow-sky-500/20' : 'border-slate-600 hover:border-slate-400 bg-black/30 hover:bg-black/40'}`}
                onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <svg className="w-10 h-10 mb-3 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                    <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-slate-500">Image (PNG, JPG) or PDF</p>
                    {fileName && <p className="mt-2 text-sm font-medium text-sky-400 truncate max-w-xs">{fileName}</p>}
                </div>
                <input id="file-upload" type="file" className="hidden" onChange={handleInputChange} accept="image/*,application/pdf" />
            </label>
        )}

        {mode === 'camera' && (
            <div className="w-full h-auto bg-black/30 rounded-xl border-2 border-slate-600 border-dashed p-4 flex flex-col items-center space-y-4">
                <div className="w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
                    {capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                    ) : (
                        <video ref={videoRef} autoPlay playsInline className={`w-full h-full object-cover ${!stream ? 'hidden' : ''}`}/>
                    )}
                    {!stream && !capturedImage && !cameraError && (
                        <p className="text-slate-400">Starting camera...</p>
                    )}
                    {cameraError && (
                        <div className="p-4 text-center text-red-300 text-sm">
                            <p className="font-bold">Camera Error</p>
                            <p>{cameraError}</p>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {capturedImage ? (
                     <div className="flex items-center space-x-4">
                        <button onClick={retakePhoto} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors">Retake</button>
                        <button onClick={usePhoto} className="px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white font-bold transition-colors">Use Photo</button>
                     </div>
                ) : (
                    <button onClick={takePhoto} disabled={!stream} className="p-4 rounded-full bg-slate-200 hover:bg-white disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors ring-4 ring-offset-4 ring-offset-slate-800 ring-slate-200/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                )}
                {fileName && <p className="mt-2 text-sm font-medium text-sky-400 truncate max-w-xs">{fileName}</p>}
            </div>
        )}
    </div>
  );
};

export default InputMethod;
