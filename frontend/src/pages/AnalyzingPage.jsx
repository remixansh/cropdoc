import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResultPage from './ResultPage';
import { saveScanResult } from '../utils/cache';

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

        // Use environment variable for backend URL or fallback to localhost
        const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        // Native fetch for stream consumption
        const res = await fetch(`${apiUrl}/api/predict`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        clearTimeout(timer1);
        clearTimeout(timer2);
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let localInitData = null;
        let localStreamedText = "";
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            if (localInitData) {
              const unifiedData = {
                crop: localInitData.crop,
                disease: localInitData.disease,
                confidence: localInitData.confidence_score,
                weather: localInitData.weather_context,
                preview: location.state.preview,
                treatmentRaw: localStreamedText
              };
              saveScanResult(unifiedData);
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\\n');
          
          // The last element is either an empty string (if buffer ended with \n) 
          // or an incomplete chunk. Save it back to buffer.
          buffer = lines.pop();

          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const payload = JSON.parse(line);
              
              if (payload.type === 'init') {
                localInitData = payload.data;
                setInitData(payload.data);
                setView('result'); // Hot-swap the UI instantly
              } else if (payload.type === 'chunk') {
                localStreamedText += payload.text;
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
      <main className="pt-14 pb-12 min-h-screen max-w-md md:max-w-4xl md:px-8 mx-auto px-4 bg-surface flex flex-col md:flex-row md:items-start md:gap-12 md:pt-16">
        
        <div className="w-full md:flex-1 flex flex-col gap-6">
          <section className="mt-8 md:mt-4">
            <span className="font-label text-[10px] md:text-[12px] font-bold uppercase tracking-[0.05em] text-outline mb-2 block">Diagnostics in progress</span>
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface leading-tight">Analyzing Specimen</h2>
          </section>

          <div className="relative w-full h-40 md:h-[450px] rounded-[16px] overflow-hidden bg-surface-container-low shadow-sm">
            <img src={location.state?.preview || "https://lh3.googleusercontent.com/aida-public/AB6AXuChExXC3dkmjeDnyHovwqz-HUWLG6JzyQ-eUPz7X0v-ae41B5UIlAbP5g6Ebj2aOX9PvILI_PAQD7Ict2p4FE2IJ4DMiHRMiOr7Ox6Y78H128m3gl4bym8z0DWZNV19m4wg11leCPQBycYT2XtVKM5syyu6q-9xaxgJI1W50YtxGd7iJghS96OTUiyDyvXhzBe2IZvaWURhuZtmlDJCOKMvAjHdTKU1u7O0tV4Rs_lwVyGNFguKHj0N2Trl8mOGlvObmtKS7bGDnN9t"} className="w-full h-full object-cover grayscale opacity-40 blur-[2px]" alt="Scan" />
            <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px]"></div>
            <div className="absolute w-full h-[2.5px] bg-[#52B788] shadow-[0_0_15px_rgba(82,183,136,1)] z-10 animate-scan"></div>
          </div>
        </div>

        <div className="w-full md:flex-1 flex flex-col gap-6 md:mt-4">
          <section className="bg-white p-6 md:p-8 rounded-[16px] flex flex-col gap-6 shadow-sm border-[0.5px] border-outline-variant">
            <div className={`flex items-start gap-5 transition-opacity duration-300 ${step > 1 ? 'opacity-100' : 'opacity-100'}`}>
              <div className="mt-1 flex-shrink-0">
                <div className={`w-[14px] h-[14px] rounded-full ${step > 1 ? 'bg-primary ring-[6px] ring-primary-fixed/30' : 'bg-primary animate-pulse-custom'}`}></div>
              </div>
              <div className="flex flex-col">
                <span className="font-label text-[13px] md:text-[14px] font-bold text-primary">{step > 1 ? 'Completed' : 'Processing'}</span>
                <p className="text-[16px] md:text-[18px] font-medium text-on-surface">Identifying disease pattern</p>
              </div>
            </div>

            <div className={`flex items-start gap-5 transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
              <div className="mt-1 flex-shrink-0">
                <div className={`w-[14px] h-[14px] rounded-full ${step > 2 ? 'bg-primary ring-[6px] ring-primary-fixed/30' : step === 2 ? 'bg-primary animate-pulse-custom' : 'border-2 border-outline'}`}></div>
              </div>
              <div className="flex flex-col">
                <span className={`font-label text-[13px] md:text-[14px] font-bold ${step >= 2 ? 'text-primary' : 'text-outline'}`}>{step > 2 ? 'Completed' : step === 2 ? 'Processing' : 'Queued'}</span>
                <p className="text-[16px] md:text-[18px] font-medium text-on-surface">Checking local weather</p>
              </div>
            </div>

            <div className={`flex items-start gap-5 transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
              <div className="mt-1 flex-shrink-0">
                <div className={`w-[14px] h-[14px] rounded-full ${step === 3 ? 'bg-primary animate-pulse-custom' : 'border-2 border-outline'}`}></div>
              </div>
              <div className="flex flex-col">
                <span className={`font-label text-[13px] md:text-[14px] font-bold ${step === 3 ? 'text-primary' : 'text-outline'}`}>{step === 3 ? 'Processing' : 'Queued'}</span>
                <p className="text-[16px] md:text-[18px] font-medium text-on-surface">Consulting AI agronomist</p>
              </div>
            </div>
          </section>

          <div className="bg-surface-container-lowest p-5 md:p-6 rounded-[16px] border-[0.5px] border-outline-variant shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-secondary text-[22px]">auto_awesome</span>
              <span className="font-label text-[11px] font-bold uppercase tracking-[0.1em] text-outline">Processing Insights</span>
            </div>
            <p className="text-on-surface-variant text-[15px] leading-[1.6] italic font-serif">
              "Early detection of fungal spotting can prevent up to 85% of crop loss if treated within the first 48 hours."
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
