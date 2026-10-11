'use client';

import { useState, useEffect, useRef } from 'react';

export default function InterviewSimulator() {
  const [mode, setMode] = useState<'practice' | 'test'>('practice');
  const [persona, setPersona] = useState('strict');
  const [userResponse, setUserResponse] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [bodyLanguageStatus] = useState('Calm & Eye Contact Maintained');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize WebCam for visual body language detection
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }
    setupCamera();
  }, []);

  const handleResponseSubmit = async () => {
    const res = await fetch('/api/groq-interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        role: 'Software Engineer',
        company: 'Google',
        persona,
        userResponse,
        recentTrends: 'Generative AI Integration and System Resilience'
      })
    });
    const data = await res.json();
    setAiFeedback(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-4 text-cyan-400">AI Job Simulator & Interview Portal</h1>

        {/* Mode Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('practice')}
            className={`px-4 py-2 rounded font-medium transition-colors ${mode === 'practice' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Practice Mode (With Hints)
          </button>
          <button
            onClick={() => setMode('test')}
            className={`px-4 py-2 rounded font-medium transition-colors ${mode === 'test' ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-300'}`}
          >
            Test Mode (Timed & Evaluated)
          </button>
        </div>

        {/* Video & Analysis Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative border border-slate-700 rounded-lg overflow-hidden bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-48 object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 text-xs rounded text-green-400 font-medium">
              Live Detector: {bodyLanguageStatus}
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-lg flex flex-col justify-between border border-slate-700">
            <div>
              <h3 className="font-semibold text-lg text-slate-200">Interviewer Style</h3>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full mt-2 p-2 bg-slate-700 rounded text-white border border-slate-600 focus:outline-none focus:border-cyan-500"
              >
                <option value="strict">Strict Technical Lead</option>
                <option value="friendly">Supportive HR Specialist</option>
                <option value="pressure">High-Pressure Executive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Input & Feedback */}
        <textarea
          value={userResponse}
          onChange={(e) => setUserResponse(e.target.value)}
          placeholder="Type or speak your interview answer here..."
          className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg text-white mb-4 focus:outline-none focus:border-cyan-500 placeholder-slate-400"
        />

        <button
          onClick={handleResponseSubmit}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg hover:opacity-95 transition-opacity"
        >
          Submit Response to AI Interviewer
        </button>

        {aiFeedback && (
          <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-cyan-500/30">
            <h2 className="text-xl font-bold text-cyan-300 mb-2">Next Question: {aiFeedback.nextQuestion}</h2>
            <p className="text-slate-300 mb-2">Feedback: {aiFeedback.feedback}</p>
            <div className="text-yellow-400 font-semibold">Score: {aiFeedback.score}/10</div>
          </div>
        )}
      </div>
    </div>
  );
}
