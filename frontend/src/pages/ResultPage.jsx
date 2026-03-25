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
      <main className="max-w-md md:max-w-4xl md:px-8 mx-auto pt-14 pb-12 px-4 flex flex-col md:flex-row md:gap-12 md:items-start md:pt-16">
        
        <div className="w-full md:w-[40%] flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden shadow-sm border-l-[3px] border-l-[#52B788]">
            <div className="p-4 bg-white">
              <p className="text-[9px] font-label font-bold tracking-[0.05em] text-[#6B6560] mb-1">CROP DETECTED</p>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-[16px] xl:text-[18px] font-semibold text-[#1A1A1A] leading-tight">{data.crop} — {data.disease}</h2>
                <span className="bg-[#52B788]/10 text-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold font-label shrink-0 ml-2">
                  {(data.confidence * 100).toFixed(1)}% confidence
                </span>
              </div>
              <hr className="border-[#E4E0D8] mb-4"/>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-surface-container border border-[#E4E0D8] shrink-0">
                  <img src={data.preview} alt="Crop" className="w-full h-full object-cover"/>
                </div>
                <div className="flex items-center gap-1.5 text-[#6B6560] italic text-[10px] md:text-[12px] font-medium leading-snug">
                  <span className="material-symbols-outlined text-[14px] md:text-[16px]">partly_cloudy_day</span>
                  <span className="flex-1">{data.weather || "Real-time weather context applied."}</span>
                </div>
              </div>
            </div>
          </section>

          {yieldImpactSentence && (
              <section className="bg-[#E07B39]/10 border-l-[3px] border-l-[#E07B39] p-4 rounded-[14px] flex items-center gap-3 animate-pulse shadow-sm">
                <span className="material-symbols-outlined text-[#7A3D10] text-[20px] md:text-[24px]">warning</span>
                <p className="text-[12px] md:text-[13.5px] font-medium text-[#7A3D10] leading-snug">{yieldImpactSentence.replace(/\*/g, '')}</p>
              </section>
          )}

          <button onClick={onNewScan || (() => navigate('/'))} className="w-full h-14 hidden md:flex border-[1.5px] border-[#2d6a4f] text-[#2d6a4f] font-bold rounded-[14px] items-center justify-center gap-2 hover:bg-[#2d6a4f]/5 transition-colors active:scale-95 duration-150 mt-auto shadow-sm">
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            Scan another plant
          </button>
        </div>

        <div className="w-full md:w-[60%] mt-6 md:mt-0 flex flex-col gap-6">
          <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden bg-white shadow-sm flex-1">
            <div className="p-4 md:p-6 h-full flex flex-col">
              <h3 className="text-[13px] md:text-[15px] font-bold text-[#1A1A1A] mb-5">Recommended actions</h3>
              <div className="space-y-5 flex-1">
                {stepsList.length > 0 ? stepsList.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start animate-fade-in transition-all">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#2d6a4f]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[12px] md:text-[14px] font-bold text-[#2d6a4f]">{idx + 1}</span>
                    </div>
                    <p className="text-[14px] md:text-[15px] text-on-surface-variant pt-0.5 leading-relaxed">{step}</p>
                    </div>
                )) : (
                    <div className="flex gap-4 items-center h-full justify-center opacity-60">
                      <div className="w-3 h-3 rounded-full bg-primary animate-pulse-custom"></div>
                      <p className="text-[14px] md:text-[15px] text-on-surface-variant italic font-medium">Generating treatment plan...</p>
                    </div>
                )}
              </div>

              {stepsList.length > 0 && (
                <div className="bg-[#FDF0E6] rounded-xl p-4 mt-8">
                  <p className="text-[9px] md:text-[10px] font-bold text-[#7A6010] tracking-[0.1em] mb-1.5 uppercase">AI ADVISORY</p>
                  <p className="text-[10px] md:text-[12px] text-[#7A6010] leading-relaxed">These treatment steps were generated organically based on hyper-local weather datasets and 38-class MobileNet diagnostics.</p>
                </div>
              )}
            </div>
          </section>

          <button onClick={onNewScan || (() => navigate('/'))} className="w-full h-14 md:hidden border-[1.5px] border-[#2d6a4f] text-[#2d6a4f] font-bold rounded-[14px] flex items-center justify-center gap-2 hover:bg-[#2d6a4f]/5 transition-colors active:scale-95 duration-150 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            Scan another plant
          </button>
        </div>
      </main>

    </div>
  );
}
