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
      {/* TopAppBar - only visible on small screens since Sidebar takes over on md */}
      <header className="fixed top-0 left-0 right-0 z-50 flex md:hidden justify-between items-center px-4 h-14 bg-[#fbf9f4] dark:bg-[#1b1c19] border-b border-surface-variant/30 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0f5238] dark:text-[#b1f0ce]" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
          <h1 className="font-headline font-bold text-[17px] tracking-tight text-[#0f5238] dark:text-[#b1f0ce]">CropDoc</h1>
        </div>
        <div className="text-[#0f5238] dark:text-[#b1f0ce] font-headline font-bold text-[17px] tracking-tight">EN | HI</div>
      </header>

      <main className="pt-20 pb-24 px-4 max-w-[1200px] mx-auto min-h-screen flex flex-col md:grid md:grid-cols-2 md:gap-12 md:items-start md:pt-14">
        {/* Left Column for Desktop */}
        <div className="flex flex-col md:sticky md:top-24 mt-4 md:mt-0">
          {/* Hero Image */}
          <div className="mb-6 md:mb-8 overflow-hidden rounded-xl h-48 md:h-[300px] lg:h-[350px] w-full relative shadow-sm">
            <img alt="Leaf" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ2xix83actB1HNhbX1Rg5-929jxbrFfoBZCEvSxuzYPoeSjOWJa7VWBC-6IPYbryuSNfsCj1rCexp4UvjDD_3hAzy-dhrGf2YqrDTpZuiT2d3wO51v9mpeEXpGwPAE9QuMw8LgsGJoiLiB0ojAdlAKD4o7cznSLip0sLHy8cLiGPUSnO0UVN4eMqYvF1eDXJUa9Fk5dvRP4_7QoSz4C6l_dURqkw_BnlRtVg5ux5xojf4FjKB8EzqLFEg7wuP_usrPqIBYZd9CS0G"/>
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
          </div>

          {/* Headline */}
          <div className="mb-6 md:mb-0">
            <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1 block">Plant Diagnostics</span>
            <h2 className="font-headline text-3xl lg:text-5xl font-medium text-on-surface leading-tight">Identify health issues instantly.</h2>
          </div>
        </div>

        {/* Right Column for Desktop */}
        <div className="flex flex-col flex-1 h-full min-h-[calc(100vh-140px)] md:min-h-0 container max-w-md mx-auto md:mx-0 md:max-w-none">

        <div className="w-full md:flex-1 order-2 flex flex-col justify-center">
          {/* Upload Zone */}
          <div className="mb-6" onClick={() => fileInputRef.current.click()}>
            <input type="file" hidden accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
            {!imagePreview ? (
              <div className="w-full min-h-[220px] md:min-h-[260px] rounded-xl border-[1.5px] border-dashed border-[#52B788] bg-[#2D6A4F]/[0.04] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors hover:bg-[#2D6A4F]/[0.08]">
                <span className="material-symbols-outlined text-[#2D6A4F] text-4xl mb-3" style={{fontVariationSettings: "'FILL' 0"}}>potted_plant</span>
                <p className="font-body font-semibold text-on-surface text-[15px] mb-1">Tap to photograph a leaf</p>
                <p className="font-body text-outline text-[13px]">or drag and drop an image</p>
              </div>
            ) : (
              <div className="w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden relative cursor-pointer border-[1.5px] border-[#52B788] shadow-sm">
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
                <label className="font-label text-[11px] font-bold uppercase tracking-wider text-outline mb-2 block">Farm size (acres)</label>
                <input value={farmSize} onChange={e => setFarmSize(e.target.value)} className="w-full bg-surface-container-lowest border border-[#E4E0D8] rounded-xl px-4 py-3 text-on-surface focus:ring-0 focus:border-primary transition-all font-body text-[15px] outline-none shadow-sm" type="number"/>
              </div>
              <div className="flex gap-4">
                  <div className="flex-1">
                      <label className="font-label text-[11px] font-bold uppercase tracking-wider text-outline mb-2 block">Latitude</label>
                      <input value={lat} onChange={e => setLat(e.target.value)} className="w-full bg-surface-container-lowest border border-[#E4E0D8] rounded-xl px-4 py-3 text-on-surface outline-none shadow-sm" type="number" step="any"/>
                  </div>
                  <div className="flex-1">
                      <label className="font-label text-[11px] font-bold uppercase tracking-wider text-outline mb-2 block">Longitude</label>
                      <input value={lon} onChange={e => setLon(e.target.value)} className="w-full bg-surface-container-lowest border border-[#E4E0D8] rounded-xl px-4 py-3 text-on-surface outline-none shadow-sm" type="number" step="any"/>
                  </div>
              </div>
          </div>

          <div className="mt-auto">
            <button onClick={submitAnalysis} className="w-full h-[54px] bg-[#2D6A4F] text-white font-body font-bold text-[14px] rounded-[14px] flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-md">
              Analyze Plant
              <span className="material-symbols-outlined text-[18px]">analytics</span>
            </button>
            <footer className="mt-6 pb-6 text-center">
              <p className="font-body text-[10px] font-medium text-[#6B6560] tracking-wide">No data stored. Analysis runs on device + AI.</p>
            </footer>
          </div>
        </div>
        </div>
      </main>

      {/* Bottom Nav - Only on mobile devices */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center px-6 pb-6 pt-2 bg-[#fbf9f4]/85 dark:bg-[#1b1c19]/85 backdrop-blur-md border-t border-[#bfc9c1]/15 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center justify-center bg-[#2d6a4f] text-white rounded-xl p-3"><span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>home</span></button>
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#2d6a4f]/10 dark:hover:bg-[#32332e] rounded-xl transition-all"><span className="material-symbols-outlined">camera_alt</span></button>
        <button className="flex flex-col items-center justify-center text-[#2d6a4f]/70 dark:text-[#b1f0ce]/70 p-3 hover:bg-[#2d6a4f]/10 dark:hover:bg-[#32332e] rounded-xl transition-all"><span className="material-symbols-outlined">person</span></button>
      </nav>
    </div>
  );
}
