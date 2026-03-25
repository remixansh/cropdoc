import { useNavigate } from "react-router-dom";

export default function Header({ showBack = false, title = "CropDoc" }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 h-14 max-w-md mx-auto bg-surface">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate("/")}
            className="hover:bg-surface-container p-2 rounded-full transition-colors"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
        )}
        <span className="material-symbols-outlined text-primary">eco</span>
        <h1 className="font-headline font-bold text-[17px] tracking-tight text-primary">
          {title}
        </h1>
      </div>
      <button className="text-primary font-headline font-bold text-[14px] hover:bg-surface-container px-3 py-1 rounded-lg transition-colors">
        EN | HI
      </button>
    </header>
  );
}
