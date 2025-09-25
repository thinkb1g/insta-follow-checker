import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import AdminPage from './pages/AdminPage';
import UserPage from './pages/UserPage';
import Header from './components/Header';
import AdBanner from './components/AdBanner';

function App() {

const [activeMenu, setActiveMenu] = useState('user');
  
  return (
    <AppProvider>
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
          <Header activeMenu={activeMenu as 'user' | 'admin'} setActiveMenu={setActiveMenu} />
          <div className="flex-grow w-full max-w-7xl mx-auto flex">
            {/* Left Ad */}
            <aside className="hidden lg:flex flex-col justify-center w-40 flex-shrink-0 py-8 pr-8">
              <AdBanner
                slot="1234567890" // IMPORTANT: Replace with your ad slot ID
                className="w-full h-full"
                style={{ minHeight: '600px' }}
              />
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <main className="py-4 md:py-8">
                {
                  activeMenu === 'user' ? <UserPage /> : <AdminPage />
                }
                {/* <Routes>
                  <Route path="/" element={<UserPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes> */}
              </main>
            </div>

            {/* Right Ad */}
            <aside className="hidden lg:flex flex-col justify-center w-40 flex-shrink-0 py-8 pl-8">
               <AdBanner
                slot="1234567890" // IMPORTANT: Replace with your ad slot ID
                className="w-full h-full"
                style={{ minHeight: '600px' }}
              />
            </aside>
          </div>

          {/* Bottom Ad */}
          <footer className="w-full bg-gray-800 border-t border-gray-700 mt-auto">
            <div className="container mx-auto p-4 flex justify-center items-center">
               <AdBanner
                slot="1234567890" // IMPORTANT: Replace with your ad slot ID
                className="w-full max-w-4xl"
              />
            </div>
          </footer>
        </div>
    </AppProvider>
  );
}

export default App;
