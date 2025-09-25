import React from 'react';

interface HeaderProps {
  activeMenu: 'user' | 'admin';
  setActiveMenu: (menu: 'user' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ activeMenu, setActiveMenu }) => {
  const activeLinkStyle = {
    color: '#6366f1',
    borderBottom: '2px solid #6366f1'
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-white tracking-wider">
                Insta<span className="text-indigo-500">Follow</span> Checker
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <div 
                // to="/" 
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={ activeMenu === 'user' ? activeLinkStyle : undefined}
                onClick={() => setActiveMenu('user')}
                >
                사용자
              </div>
              <div 
                // to="/admin" 
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                style={activeMenu === 'admin' ? activeLinkStyle : undefined}
                onClick={() => setActiveMenu('admin')}
              >
                관리자
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;