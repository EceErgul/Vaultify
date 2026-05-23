import React from 'react';

const CurrentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--bg-sidebar)] text-[var(--sidebar-text)] py-8 px-12 border-t border-black/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
        
        <div className="flex items-center space-x-1 opacity-90">
          <span>© {CurrentYear} - </span>
          <span className="font-bold text-[var(--sidebar-accent)] tracking-tight">VAULTIFY</span>
          <span> · All rights reserved</span>
        </div>

        <div className="flex items-center space-x-3 bg-[var(--sidebar-active)]]">
          <span className="font-semibold text-white">Contact:</span>
          <a 
            href="mailto:contact@vaultify.com"
            className="text-[var(--sidebar-text)] hover:text-[var(--sidebar-accent)] transition-all duration-300 font-medium"
          >
            contact@vaultify.com
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;