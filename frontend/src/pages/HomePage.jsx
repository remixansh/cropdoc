import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { predictDisease } from "../api";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ2xix83actB1HNhbX1Rg5-929jxbrFfoBZCEvSxuzYPoeSjOWJa7VWBC-6IPYbryuSNfsCj1rCexp4UvjDD_3hAzy-dhrGf2YqrDTpZuiT2d3wO51v9mpeEXpGwPAE9QuMw8LgsGJoiLiB0ojAdlAKD4o7cznSLip0sLHy8cLiGPUSnO0UVN4eMqYvF1eDXJUa9Fk5dvRP4_7QoSz4C6l_dURqkw_BnlRtVg5ux5xojf4FjKB8EzqLFEg7wuP_usrPqIBYZd9CS0G";

export default function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [farmSize, setFarmSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((selectedFile) => {
    if (selectedFile && (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError("");
    } else if (selectedFile) {
      setError("Please upload a JPEG or PNG image.");
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a leaf image.");
      return;
    }
    if (!farmSize || Number(farmSize) <= 0) {
      setError("Please enter a valid farm size.");
      return;
    }

    setLoading(true);
    setError("");

    // Navigate to analyzing page immediately, pass state
    navigate("/analyzing", {
      state: { file, preview, farmSize: Number(farmSize) },
    });
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-24 px-4 max-w-md mx-auto min-h-screen flex flex-col">
        {/* Hero Image */}
        <div className="mb-8 overflow-hidden rounded-xl h-48 w-full relative">
          <img
            alt="Vibrant green plant leaf with intricate vein details in soft morning sunlight"
            className="w-full h-full object-cover"
            src={HERO_IMG}
          />
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
        </div>

        {/* Headline */}
        <div className="mb-6">
          <span className="font-label text-[10px] uppercase tracking-[0.15em] text-outline mb-1 block">
            Plant Diagnostics
          </span>
          <h2 className="font-headline text-3xl font-medium text-on-surface leading-tight">
            Identify health issues instantly.
          </h2>
        </div>

        {/* Upload Zone */}
        <div className="mb-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
            className={`w-full min-h-[220px] rounded-xl border-[1.5px] border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-primary bg-primary/10"
                : preview
                ? "border-primary-container bg-primary-container/5"
                : "border-[#52B788] bg-primary-container/[0.04] hover:bg-primary-container/[0.08]"
            }`}
          >
            {preview ? (
              <div className="relative w-full h-40">
                <img
                  src={preview}
                  alt="Selected leaf"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-error text-on-error rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-primary-container text-4xl mb-3">
                  potted_plant
                </span>
                <p className="font-body font-semibold text-on-surface text-[15px] mb-1">
                  Tap to photograph a leaf
                </p>
                <p className="font-body text-outline text-[13px]">or drag and drop an image</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
        </div>

        {/* Farm Size Input */}
        <div className="mb-8">
          <label
            className="font-label text-[11px] uppercase tracking-wider text-outline mb-2 block"
            htmlFor="farm-size"
          >
            Farm size (acres)
          </label>
          <input
            id="farm-size"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="e.g. 2.5"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            className="w-full bg-surface-container-lowest border border-[#E4E0D8] rounded-lg px-4 py-3 text-on-surface focus:ring-0 focus:border-primary transition-all font-body text-[15px] outline-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-error-container text-on-error-container text-[13px] font-medium">
            {error}
          </div>
        )}

        {/* Primary Action */}
        <div className="mt-auto">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-[52px] bg-primary-container text-white font-body font-medium text-[13px] rounded-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Preparing…" : "Analyze Plant"}
            <span className="material-symbols-outlined text-[18px]">analytics</span>
          </button>

          {/* Footer */}
          <footer className="mt-6 pb-6 text-center">
            <p className="font-body text-[9px] text-[#6B6560] tracking-wide">
              No data stored. Analysis runs on device + AI.
            </p>
          </footer>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
