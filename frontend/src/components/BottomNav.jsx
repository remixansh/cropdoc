import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  { icon: "home", path: "/" },
  { icon: "camera_alt", path: "/scan" },
  { icon: "person", path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeTab = pathname === "/result" || pathname === "/analyzing" ? "camera_alt" : "home";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-6 pb-6 pt-2 max-w-md mx-auto bg-surface/85 backdrop-blur-md border-t border-outline-variant/15 rounded-t-2xl">
      {tabs.map((tab) => {
        const isActive =
          tab.icon === activeTab ||
          (tab.path === "/" && pathname === "/");

        return (
          <button
            key={tab.icon}
            onClick={() => {
              if (tab.path === "/") navigate("/");
            }}
            className={`flex flex-col items-center justify-center p-3 transition-all ${
              isActive
                ? "bg-primary-container text-white rounded-xl"
                : "text-primary-container/70 hover:bg-surface-container"
            }`}
            style={
              isActive
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
