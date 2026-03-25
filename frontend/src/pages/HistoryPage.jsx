import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScanHistory, clearScanHistory } from '../utils/cache';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your scan history?")) {
      clearScanHistory();
      setHistory([]);
    }
  };

  const handleCardClick = (scan) => {
    // Navigate to ResultPage and pass the scan data
    navigate('/result', { state: scan });
  };

  return (
    <div className="bg-[#f7f5f0] text-on-surface min-h-screen">
      <main className="pt-14 pb-12 px-4 max-w-md md:max-w-4xl md:px-8 mx-auto space-y-4">
        <div className="flex items-center justify-between mb-4 md:pl-0 pl-10">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-[#0f5238] dark:text-[#b1f0ce]">Scan History</h1>
          {history.length > 0 && (
            <button onClick={handleClear} className="text-error font-medium text-sm hover:underline">
              Clear
            </button>
          )}
        </div>
        
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20 opacity-60">
            <span className="material-symbols-outlined text-6xl mb-4">history_toggle_off</span>
            <p className="text-lg font-medium">No history yet</p>
            <p className="text-sm">Your scanned plants will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {history.map((scan) => (
              <div 
                key={scan.id} 
                onClick={() => handleCardClick(scan)}
                className="bg-white rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                  {scan.preview ? (
                    <img src={scan.preview} alt={scan.crop} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2d6a4f]/10">
                      <span className="material-symbols-outlined text-[#2d6a4f]">eco</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">{scan.crop}</h3>
                  <p className="text-sm text-on-surface-variant truncate">{scan.disease}</p>
                  <p className="text-xs text-outline mt-1">
                    {new Date(scan.timestamp).toLocaleDateString(undefined, { 
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="shrink-0 flex items-center">
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
