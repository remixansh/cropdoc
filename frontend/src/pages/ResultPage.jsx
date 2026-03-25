import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ResultPage({ presetData, onNewScan }) {
  const location = useLocation();
  const navigate = useNavigate();
  // Allow running directly from Route state OR passed props via AnalyzingPage streaming
  const data = presetData || location.state;

  if (!data) return <button onClick={() => navigate('/')}>Go Back</button>;

  // Dynamically parse the streaming markdown block from GenAI
  const rawText = data.treatmentRaw || "";
  
  // Look for any line containing % to identify the Yield sentence (e.g. "Potential 20-30% loss")
  const textLines = rawText.split('\\n');
  const yieldImpactSentence = textLines.find(line => line.includes('%') || line.toLowerCase().includes('yield'));
  
  // Extract Steps (e.g., "1. ...", "2. ...")
  const stepsList = textLines
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/\*\*/g, ''));

  return (
    <div className="bg-[#f7f5f0] text-on-surface min-h-screen">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14 max-w-md mx-auto bg-[#fbf9f4] dark:bg-[#1b1c19]">
        <div className="flex items-center gap-3">
          <button onClick={onNewScan || (() => navigate('/'))} className="hover:bg-[#f0eee9] dark:hover:bg-[#32332e] transition-colors p-2 rounded-full">
            <span className="material-symbols-outlined text-[#0f5238] dark:text-[#b1f0ce]">arrow_back</span>
          </button>
          <h1 className="font-serif font-bold text-[17px] tracking-tight text-[#0f5238] dark:text-[#b1f0ce]">New scan</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-20 pb-28 px-4 space-y-6">
        <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden shadow-sm border-l-[3px] border-l-[#52B788]">
          <div className="p-4 bg-white">
            <p className="text-[9px] font-label font-bold tracking-[0.05em] text-[#6B6560] mb-1">CROP DETECTED</p>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[16px] font-semibold text-[#1A1A1A] leading-tight">{data.crop} — {data.disease}</h2>
              <span className="bg-[#52B788]/10 text-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold font-label">
                {(data.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
            <hr className="border-[#E4E0D8] mb-4"/>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container border border-[#E4E0D8]">
                <img src={data.preview} alt="Crop" className="w-full h-full object-cover"/>
              </div>
              <div className="flex items-center gap-1.5 text-[#6B6560] italic text-[10px] font-medium leading-snug">
                <span className="material-symbols-outlined text-[14px]">partly_cloudy_day</span>
                <span className="flex-1">{data.weather || "Real-time weather context applied."}</span>
              </div>
            </div>
          </div>
        </section>

        {yieldImpactSentence && (
            <section className="bg-[#E07B39]/10 border-l-[3px] border-l-[#E07B39] p-4 rounded-lg flex items-center gap-3 animate-pulse">
              <span className="material-symbols-outlined text-[#7A3D10] text-[20px]">warning</span>
              <p className="text-[12px] font-medium text-[#7A3D10]">{yieldImpactSentence.replace(/\*/g, '')}</p>
            </section>
        )}

        <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden bg-white shadow-sm">
          <div className="p-4">
            <h3 className="text-[13px] font-medium text-[#1A1A1A] mb-4">Recommended actions</h3>
            <div className="space-y-4">
              {stepsList.length > 0 ? stepsList.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start animate-fade-in transition-all">
                  <div className="w-6 h-6 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-[#2d6a4f]">{idx + 1}</span>
                  </div>
                  <p className="text-[14px] text-on-surface-variant pt-0.5">{step}</p>
                  </div>
              )) : (
                  <div className="flex gap-3 items-center">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse-custom"></div>
                    <p className="text-[14px] text-on-surface-variant italic">Generating treatment plan...</p>
                  </div>
              )}

              <div className="bg-[#FDF0E6] rounded-xl p-3 mt-4">
                <p className="text-[9px] font-bold text-[#7A6010] tracking-wider mb-1 uppercase">AI ADVISORY</p>
                <p className="text-[10px] text-[#7A6010] leading-relaxed">These treatment steps were generated organically based on hyper-local weather datasets and 38-class MobileNet diagnostics.</p>
              </div>
            </div>
          </div>
        </section>

        <button onClick={onNewScan || (() => navigate('/'))} className="w-full h-12 border-[1.5px] border-[#2d6a4f] text-[#2d6a4f] font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#2d6a4f]/5 transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          Scan another plant
        </button>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-2 max-w-md mx-auto bg-[#fbf9f4]/85 dark:bg-[#1b1c19]/85 backdrop-blur-md rounded-t-2xl border-t border-[#bfc9c1]/15">
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#f0eee9] dark:hover:bg-[#32332e] transition-all"><span className="material-symbols-outlined">home</span></button>
        <button className="flex flex-col items-center justify-center bg-[#2d6a4f] text-white rounded-xl p-3 active:scale-90 transition-transform duration-200"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>camera_alt</span></button>
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#f0eee9] dark:hover:bg-[#32332e] transition-all"><span className="material-symbols-outlined">person</span></button>
      </nav>
    </div>
  );
}
