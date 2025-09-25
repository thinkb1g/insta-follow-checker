import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { getTargetListFromSheet } from '../api/sheetApi';

interface AppContextType {
  targetList: string[];
  isAdminLoggedIn: boolean;
  loginAdmin: () => void;
  isLoadingList: boolean;
  error: string | null;
  refetchList: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [targetList, setTargetListState] = useState<string[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = async () => {
      setIsLoadingList(true);
      setError(null);
      try {
        const list = await getTargetListFromSheet();
        setTargetListState(list);
      } catch (e: any) {
        console.error("Failed to fetch target list from sheet", e);
        setError(e.message || '리스트를 불러오는 데 실패했습니다.');
        setTargetListState([]); // Clear list on error
      } finally {
        setIsLoadingList(false);
      }
  };
  
  useEffect(() => {
    fetchList();
  }, []);

  const loginAdmin = () => setIsAdminLoggedIn(true);

  return (
    <AppContext.Provider value={{ targetList, isAdminLoggedIn, loginAdmin, isLoadingList, error, refetchList: fetchList }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};