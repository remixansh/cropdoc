import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Close sidebar on navigation event on mobile
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Scan Plant', path: '/', icon: 'camera_alt' },
    { name: 'History', path: '/history', icon: 'history' },
  ];

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-2 left-3 z-[60] w-10 h-10 flex items-center justify-center text-[#0f5238] dark:text-[#b1f0ce] hover:bg-black/5 rounded-full transition-colors"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[65] md:hidden backdrop-blur-[2px] transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-[#fbf9f4] dark:bg-[#1b1c19] border-r border-[#bfc9c1]/15 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.05)] md:shadow-none`}>
        <div className="h-14 flex items-center px-6 border-b border-[#bfc9c1]/15 gap-2 shrink-0">
          <span className="material-symbols-outlined text-[#0f5238] dark:text-[#b1f0ce]" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
          <h1 className="font-serif font-bold text-[19px] tracking-tight text-[#0f5238] dark:text-[#b1f0ce]">CropDoc</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => {
             // Home is active for /, /analyzing, /result
             const isActive = location.pathname === item.path || (item.path === '/' && (location.pathname === '/analyzing' || location.pathname === '/result'));
             return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[12px] transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#2d6a4f] text-white font-medium shadow-sm active:scale-[0.98]' 
                    : 'text-[#2d6a4f]/80 dark:text-[#b1f0ce]/80 font-medium hover:bg-[#f0eee9] dark:hover:bg-[#32332e] hover:text-[#2d6a4f] active:bg-[#e6e3da]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-[14px]">{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#bfc9c1]/15 text-center shrink-0">
            <p className="text-[11px] font-medium text-outline">v2.0 Beta</p>
        </div>
      </aside>
    </>
  );
}
