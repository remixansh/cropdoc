import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultPage from './ResultPage';

export default function AnalyzingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [view, setView] = useState('analyzing');
  const [initData, setInitData] = useState(null);
  const [streamedText, setStreamedText] = useState("");

  useEffect(() => {
    if (!location.state?.file) {
      navigate('/');
      return;
    }

    const performAnalysis = async () => {
      // Simulate UI steps parallel to stream bootstrap
      const timer1 = setTimeout(() => setStep(2), 2000);
      const timer2 = setTimeout(() => setStep(3), 5000);

      try {
        const formData = new FormData();
        formData.append('file', location.state.file);
        formData.append('latitude', location.state.lat);
        formData.append('longitude', location.state.lon);
        formData.append('farm_size', location.state.farmSize);
        formData.append('language', 'en'); // Default

        // Native fetch for stream consumption
        const res = await fetch('http://127.0.0.1:8000/api/predict', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        clearTimeout(timer1);
        clearTimeout(timer2);
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\\n');

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const payload = JSON.parse(line);
              
              if (payload.type === 'init') {
                setInitData(payload.data);
                setView('result'); // Hot-swap the UI instantly
              } else if (payload.type === 'chunk') {
                setStreamedText(prev => prev + payload.text);
              }
            } catch (err) {
              console.error("NDJSON Parse error on line:", line, err);
            }
          }
        }
      } catch (err) {
        alert("Analysis failed to connect: " + err.message);
        navigate('/');
      }
    };

    performAnalysis();
  }, [location, navigate]);

  if (view === 'result' && initData) {
     const unifiedData = {
         crop: initData.crop,
         disease: initData.disease,
         confidence: initData.confidence_score,
         weather: initData.weather_context,
         preview: location.state.preview,
         treatmentRaw: streamedText
     };
     // Render ResultPage directly via props to maintain React memory stream state natively
     return <ResultPage presetData={unifiedData} onNewScan={() => navigate('/')} />;
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 h-14 max-w-md mx-auto bg-[#fbf9f4] dark:bg-[#1b1c19] border-none">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0f5238] dark:text-[#b1f0ce]" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
          <h1 className="font-serif font-bold text-[17px] tracking-tight text-[#0f5238] dark:text-[#b1f0ce]">CropDoc</h1>
        </div>
      </header>

      <main className="pt-14 pb-24 min-h-screen max-w-md mx-auto px-4 bg-surface flex flex-col gap-8">
        <section className="mt-8">
          <span className="font-label text-[10px] font-medium uppercase tracking-[0.05em] text-outline mb-1 block">Diagnostics in progress</span>
          <h2 className="font-headline text-3xl font-bold text-on-surface leading-tight">Analyzing Specimen</h2>
        </section>

        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-surface-container-low">
          <img src={location.state?.preview || "https://lh3.googleusercontent.com/aida-public/AB6AXuChExXC3dkmjeDnyHovwqz-HUWLG6JzyQ-eUPz7X0v-ae41B5UIlAbP5g6Ebj2aOX9PvILI_PAQD7Ict2p4FE2IJ4DMiHRMiOr7Ox6Y78H128m3gl4bym8z0DWZNV19m4wg11leCPQBycYT2XtVKM5syyu6q-9xaxgJI1W50YtxGd7iJghS96OTUiyDyvXhzBe2IZvaWURhuZtmlDJCOKMvAjHdTKU1u7O0tV4Rs_lwVyGNFguKHj0N2Trl8mOGlvObmtKS7bGDnN9t"} className="w-full h-full object-cover grayscale opacity-40 blur-[2px]" alt="Scan" />
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm"></div>
          <div className="absolute w-full h-[2px] bg-[#52B788] shadow-[0_0_12px_rgba(82,183,136,0.8)] z-10 animate-scan"></div>
        </div>

        <section className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-6">
          <div className={`flex items-start gap-4 ${step > 1 ? 'opacity-100' : 'opacity-100'}`}>
            <div className="mt-1 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${step > 1 ? 'bg-primary ring-4 ring-primary-fixed/30' : 'bg-primary animate-pulse-custom'}`}></div>
            </div>
            <div className="flex flex-col">
              <span className="font-label text-[13px] font-semibold text-primary">{step > 1 ? 'Completed' : 'Processing'}</span>
              <p className="text-[16px] font-medium text-on-surface">Identifying disease pattern</p>
            </div>
          </div>

          <div className={`flex items-start gap-4 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="mt-1 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${step > 2 ? 'bg-primary ring-4 ring-primary-fixed/30' : step === 2 ? 'bg-primary animate-pulse-custom' : 'border-2 border-outline'}`}></div>
            </div>
            <div className="flex flex-col">
              <span className={`font-label text-[13px] font-semibold ${step >= 2 ? 'text-primary' : 'text-outline'}`}>{step > 2 ? 'Completed' : step === 2 ? 'Processing' : 'Queued'}</span>
              <p className="text-[16px] font-medium text-on-surface">Checking local weather</p>
            </div>
          </div>

          <div className={`flex items-start gap-4 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="mt-1 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${step === 3 ? 'bg-primary animate-pulse-custom' : 'border-2 border-outline'}`}></div>
            </div>
            <div className="flex flex-col">
              <span className={`font-label text-[13px] font-semibold ${step === 3 ? 'text-primary' : 'text-outline'}`}>{step === 3 ? 'Processing' : 'Queued'}</span>
              <p className="text-[16px] font-medium text-on-surface">Consulting AI agronomist</p>
            </div>
          </div>
        </section>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-[20px]">info</span>
            <span className="font-label text-[11px] font-bold uppercase tracking-wider text-outline">Journal Note</span>
          </div>
          <p className="text-on-surface-variant text-[14px] leading-relaxed italic font-serif">
            "Early detection of fungal spotting can prevent up to 85% of crop loss if treated within the first 48 hours."
          </p>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-2 max-w-md mx-auto bg-[#fbf9f4]/85 dark:bg-[#1b1c19]/85 backdrop-blur-md border-t border-[#bfc9c1]/15 rounded-t-2xl">
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#f0eee9] dark:hover:bg-[#32332e] transition-all"><span className="material-symbols-outlined">home</span></button>
        <button className="flex flex-col items-center justify-center bg-[#2d6a4f] text-white rounded-xl p-3 active:scale-90 transition-transform duration-200"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>camera_alt</span></button>
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#f0eee9] dark:hover:bg-[#32332e] transition-all"><span className="material-symbols-outlined">person</span></button>
      </nav>
    </div>
  );
}
