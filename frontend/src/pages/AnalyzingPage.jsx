import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { predictDisease } from "../api";

const STEPS = [
  { label: "Identifying disease pattern", id: "identify" },
  { label: "Checking local weather", id: "weather" },
  { label: "Consulting AI agronomist", id: "consult" },
];

export default function AnalyzingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!state?.file) {
      navigate("/", { replace: true });
      return;
    }

    if (hasStarted.current) return;
    hasStarted.current = true;

    // Animate steps while API call is in progress
    const stepTimers = [
      setTimeout(() => setActiveStep(1), 1500),
      setTimeout(() => setActiveStep(2), 3000),
    ];

    // Get geolocation and call API
    const callApi = async () => {
      let latitude = 28.6139; // default Delhi
      let longitude = 77.209;

      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        );
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      } catch {
        // use defaults
      }

      try {
        const result = await predictDisease(state.file, latitude, longitude, state.farmSize);
        // Wait at least 4s for nice UX
        setTimeout(() => {
          navigate("/result", {
            replace: true,
            state: { result: result.data, preview: state.preview },
          });
        }, Math.max(0, 4500 - Date.now()));
      } catch (err) {
        const errMsg =
          err.response?.data?.detail?.[0]?.msg ||
          err.response?.data?.detail ||
          err.message ||
          "Analysis failed. Please try again.";
        setTimeout(() => {
          navigate("/", {
            replace: true,
            state: { error: typeof errMsg === "string" ? errMsg : JSON.stringify(errMsg) },
          });
        }, 2000);
      }
    };

    callApi();

    return () => stepTimers.forEach(clearTimeout);
  }, [state, navigate]);

  return (
    <>
      <Header showBack title="New scan" />
      <main className="pt-14 pb-24 min-h-screen max-w-md mx-auto px-4 bg-surface flex flex-col gap-8">
        {/* Header */}
        <section className="mt-8">
          <span className="font-label text-[10px] font-medium uppercase tracking-[0.05em] text-outline mb-1 block">
            Diagnostics in progress
          </span>
          <h2 className="font-headline text-3xl font-bold text-on-surface leading-tight">
            Analyzing Specimen
          </h2>
        </section>

        {/* Image Preview with Scan Line */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-surface-container-low">
          {state?.preview && (
            <img
              className="w-full h-full object-cover grayscale opacity-40 blur-[2px]"
              src={state.preview}
              alt="Uploaded leaf being analyzed"
            />
          )}
          <div className="absolute inset-0 bg-surface/60 backdrop-blur-xs" />
          <div className="absolute w-full h-[2px] bg-[#52B788] shadow-[0_0_12px_rgba(82,183,136,0.8)] z-10 animate-scan" />
        </div>

        {/* Status Steps */}
        <section className="bg-surface-container-low p-6 rounded-xl flex flex-col gap-6">
          {STEPS.map((step, i) => {
            const isCompleted = i < activeStep;
            const isActive = i === activeStep;
            const isQueued = i > activeStep;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 ${isQueued ? "opacity-50" : ""}`}
              >
                <div className="mt-1 shrink-0">
                  {isCompleted && (
                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary-fixed/30" />
                  )}
                  {isActive && (
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse-custom" />
                  )}
                  {isQueued && (
                    <div className="w-3 h-3 rounded-full border-2 border-outline" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-label text-[13px] font-semibold ${
                      isCompleted ? "text-primary" : isActive ? "text-primary" : "text-outline"
                    }`}
                  >
                    {isCompleted ? "Completed" : isActive ? "Processing" : "Queued"}
                  </span>
                  <p className="text-[16px] font-medium text-on-surface">{step.label}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Journal Note */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/15">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-[20px]">info</span>
            <span className="font-label text-[11px] font-bold uppercase tracking-wider text-outline">
              Journal Note
            </span>
          </div>
          <p className="text-on-surface-variant text-[14px] leading-relaxed italic font-headline">
            "Early detection of fungal spotting can prevent up to 85% of crop loss if treated within
            the first 48 hours."
          </p>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
