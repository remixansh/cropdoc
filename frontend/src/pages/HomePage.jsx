import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [farmSize, setFarmSize] = useState("2.5");
  const [lat, setLat] = useState("28.6139");
  const [lon, setLon] = useState("77.2090");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const submitAnalysis = () => {
    if (!imageFile) return alert("Please upload a leaf image first.");
    // Pass raw file and config directly to next route state
    navigate('/analyzing', { 
        state: { 
            file: imageFile, 
            preview: imagePreview,
            farmSize, 
            lat, 
            lon 
        } 
    });
  };

  return (
    <div className="font-body text-on-surface antialiased bg-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 h-14 max-w-md md:max-w-5xl mx-auto bg-[#fbf9f4] dark:bg-[#1b1c19]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0f5238] dark:text-[#b1f0ce]" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
          <h1 className="font-headline font-bold text-[17px] tracking-tight text-[#0f5238] dark:text-[#b1f0ce]">CropDoc</h1>
        </div>
        <div className="text-[#0f5238] dark:text-[#b1f0ce] font-headline font-bold text-[17px] tracking-tight">EN | HI</div>
      </header>

      <main className="pt-20 pb-24 px-4 max-w-md md:max-w-5xl mx-auto min-h-screen flex flex-col md:grid md:grid-cols-2 md:gap-12 md:items-start">
        {/* Left Column for Desktop */}
        <div className="flex flex-col md:sticky md:top-24">
          {/* Hero Image */}
          <div className="mb-8 overflow-hidden rounded-xl h-48 w-full relative">
            <img alt="Leaf" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ2xix83actB1HNhbX1Rg5-929jxbrFfoBZCEvSxuzYPoeSjOWJa7VWBC-6IPYbryuSNfsCj1rCexp4UvjDD_3hAzy-dhrGf2YqrDTpZuiT2d3wO51v9mpeEXpGwPAE9QuMw8LgsGJoiLiB0ojAdlAKD4o7cznSLip0sLHy8cLiGPUSnO0UVN4eMqYvF1eDXJUa9Fk5dvRP4_7QoSz4C6l_dURqkw_BnlRtVg5ux5xojf4FjKB8EzqLFEg7wuP_usrPqIBYZd9CS0G"/>
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          </div>

          {/* Headline */}
          <div className="mb-6 md:mb-0">
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1 block">Plant Diagnostics</span>
            <h2 className="font-headline text-3xl md:text-5xl font-medium text-on-surface leading-tight">Identify health issues instantly.</h2>
          </div>
        </div>

        {/* Right Column for Desktop */}
        <div className="flex flex-col flex-1 h-full min-h-[calc(100vh-140px)]">

        {/* Upload Zone */}
        <div className="mb-6" onClick={() => fileInputRef.current.click()}>
          <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
          {!imagePreview ? (
            <div className="w-full min-h-[220px] rounded-xl border-[1.5px] border-dashed border-[#52B788] bg-[#2D6A4F]/[0.04] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors hover:bg-[#2D6A4F]/[0.08]">
              <span className="material-symbols-outlined text-[#2D6A4F] text-4xl mb-3" style={{fontVariationSettings: "'FILL' 0"}}>potted_plant</span>
              <p className="font-body font-semibold text-on-surface text-[15px] mb-1">Tap to photograph a leaf</p>
              <p className="font-body text-outline text-[13px]">or drag and drop an image</p>
            </div>
          ) : (
            <div className="w-full h-[220px] rounded-xl overflow-hidden relative cursor-pointer border-[1.5px] border-[#52B788]">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white font-semibold">Change Image</p>
                </div>
            </div>
          )}
        </div>

        {/* Config Section */}
        <div className="mb-8 space-y-4">
            <div>
              <label className="font-label text-[11px] uppercase tracking-wider text-outline mb-2 block">Farm size (acres)</label>
              <input value={farmSize} onChange={e => setFarmSize(e.target.value)} className="w-full bg-surface-container-lowest border border-[#E4E0D8] rounded-lg px-4 py-3 text-on-surface focus:ring-0 focus:border-primary transition-all font-body text-[15px] outline-none" type="number"/>
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="font-label text-[11px] uppercase tracking-wider text-outline mb-2 block">Latitude</label>
                    <input value={lat} onChange={e => setLat(e.target.value)} className="w-full bg-surface-container-lowest border border-[#E4E0D8] rounded-lg px-4 py-3 text-on-surface outline-none" type="number" step="any"/>
                </div>
                <div className="flex-1">
                    <label className="font-label text-[11px] uppercase tracking-wider text-outline mb-2 block">Longitude</label>
                    <input value={lon} onChange={e => setLon(e.target.value)} className="w-full bg-surface-container-lowest border border-[#E4E0D8] rounded-lg px-4 py-3 text-on-surface outline-none" type="number" step="any"/>
                </div>
            </div>
        </div>

        <div className="mt-auto">
          <button onClick={submitAnalysis} className="w-full h-[52px] bg-[#2D6A4F] text-white font-body font-medium text-[13px] rounded-[12px] flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all">
            Analyze Plant
            <span className="material-symbols-outlined text-[18px]">analytics</span>
          </button>
          <footer className="mt-6 pb-6 text-center">
            <p className="font-body text-[9px] text-[#6B6560] tracking-wide">No data stored. Analysis runs on device + AI.</p>
          </footer>
        </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-6 pb-6 pt-2 max-w-md md:max-w-sm md:rounded-full md:bottom-8 md:border md:shadow-lg md:px-6 md:pb-2 mx-auto bg-[#fbf9f4]/85 dark:bg-[#1b1c19]/85 backdrop-blur-md border-t border-[#bfc9c1]/15 rounded-t-2xl">
        <button className="flex flex-col items-center justify-center bg-[#2d6a4f] text-white rounded-xl p-3"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span></button>
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#f0eee9] dark:hover:bg-[#32332e] transition-all"><span className="material-symbols-outlined">camera_alt</span></button>
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#f0eee9] dark:hover:bg-[#32332e] transition-all"><span className="material-symbols-outlined">person</span></button>
      </nav>
    </div>
  );
}
