import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function ResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Redirect home if accessed without data
  if (!state?.result) {
    navigate("/", { replace: true });
    return null;
  }

  const { result, preview } = state;
  const {
    crop = "Unknown",
    disease = "Unknown",
    confidence_score = 0,
    weather_context = "",
    yield_impact_estimate = "",
    treatment_plan = "",
  } = result;

  const confidencePercent = (confidence_score * 100).toFixed(1);

  // Parse treatment plan: split by numbered steps
  const treatmentSteps = treatment_plan
    ? treatment_plan
        .split(/\d+\.\s*/)
        .filter((s) => s.trim())
        .map((s) => s.replace(/\\n/g, "").trim())
    : [];

  // Extract a short weather summary for the badge
  const weatherShort = weather_context.includes("dry")
    ? "Dry conditions"
    : weather_context.includes("rain")
    ? "Rain expected"
    : weather_context.includes("Sunny")
    ? "Sunny conditions"
    : "Weather checked";

  const weatherIcon = weather_context.includes("rain")
    ? "rainy"
    : weather_context.includes("dry") || weather_context.includes("Sunny")
    ? "wb_sunny"
    : "thermostat";

  return (
    <>
      <Header showBack title="New scan" />
      <main className="max-w-md mx-auto pt-20 pb-28 px-4 space-y-6">
        {/* Diagnosis Card */}
        <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden shadow-sm border-l-[3px] border-l-[#52B788]">
          <div className="p-4">
            <p className="text-[9px] font-label font-bold tracking-[0.05em] text-[#6B6560] mb-1">
              CROP DETECTED
            </p>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[16px] font-semibold text-[#1A1A1A] leading-tight">
                {crop} — {disease}
              </h2>
              <span className="bg-[#52B788]/10 text-primary-container px-2 py-0.5 rounded-full text-[10px] font-bold font-label whitespace-nowrap ml-2">
                {confidencePercent}% confidence
              </span>
            </div>
            <hr className="border-[#E4E0D8] mb-4" />
            <div className="flex items-center gap-3">
              {preview && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container shrink-0">
                  <img
                    alt={`${crop} leaf`}
                    className="w-full h-full object-cover"
                    src={preview}
                  />
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[#6B6560] italic text-[10px]">
                <span className="material-symbols-outlined text-[14px]">{weatherIcon}</span>
                <span>{weatherShort}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Yield Impact Banner */}
        {yield_impact_estimate && (
          <section className="bg-[#E07B39]/10 border-l-[3px] border-l-[#E07B39] p-4 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-[#7A3D10] text-[20px]">warning</span>
            <p className="text-[12px] font-medium text-[#7A3D10]">{yield_impact_estimate}</p>
          </section>
        )}

        {/* Treatment Card */}
        {treatmentSteps.length > 0 && (
          <section className="bg-surface-container-lowest rounded-[14px] border-[0.5px] border-outline-variant overflow-hidden">
            <div className="p-4">
              <h3 className="text-[13px] font-medium text-[#1A1A1A] mb-4">Recommended actions</h3>
              <div className="space-y-4">
                {treatmentSteps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-primary-container">{i + 1}</span>
                    </div>
                    <p className="text-[14px] text-on-surface-variant pt-0.5">{step}</p>
                  </div>
                ))}

                {/* Weather Advisory */}
                {weather_context && (
                  <div className="bg-[#FDF0E6] rounded-xl p-3 mt-4">
                    <p className="text-[9px] font-bold text-[#7A6010] tracking-wider mb-1 uppercase">
                      WEATHER ADVISORY
                    </p>
                    <p className="text-[10px] text-[#7A6010] leading-relaxed">
                      {weather_context}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Button */}
        <button
          onClick={() => navigate("/")}
          className="w-full h-12 border-[1.5px] border-primary-container text-primary-container font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-container/5 transition-colors active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          Scan another plant
        </button>
      </main>
      <BottomNav />
    </>
  );
}
