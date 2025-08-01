import React from 'react';
import { PlateProvider } from './context/PlateContext';
import Globe from './components/Globe';
import Sidebar from './components/Sidebar';
import './index.css';

const App: React.FC = () => {
  return (
    <PlateProvider>
      <div className="flex h-screen bg-gray-900">
        <div className="flex-1 relative">
          <Globe className="w-full h-full" />
        </div>
        <Sidebar />
      </div>
    </PlateProvider>
  );
};

export default App;
