const CurrentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="w-full bg-darkBg text-gray-400 py-6 px-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm">
        
        <div className="flex items-center space-x-1">
          <span>©{CurrentYear} - Vaultify · All rights reserved</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-bold text-white">Contact:</span>
          <a 
            href="mailto:contact@vaultify.com" 
            className="hover:text-vaultBlue transition-colors"
          >
            contact@vaultify.com
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;