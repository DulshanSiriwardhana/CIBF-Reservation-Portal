import React, { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react";

interface LoaderContextType {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  setLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = (): LoaderContextType => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

interface LoaderProviderProps {
  children: ReactNode;
}

export const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loadingCountRef = useRef(0);

  const showLoader = useCallback(() => {
    loadingCountRef.current += 1;
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
    if (loadingCountRef.current === 0) {
      setIsLoading(false);
    }
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    if (loading) {
      loadingCountRef.current += 1;
      setIsLoading(true);
    } else {
      loadingCountRef.current = Math.max(0, loadingCountRef.current - 1);
      if (loadingCountRef.current === 0) {
        setIsLoading(false);
      }
    }
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader, setLoading }}>
      {children}
      {isLoading && <Loader />}
    </LoaderContext.Provider>
  );
};

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#02060d]/80 backdrop-blur z-[9999] flex items-center justify-center">
      <div className="bg-[#0b1320] rounded-2xl p-10 shadow-[0_20px_90px_rgba(0,0,0,0.7)] border border-[#1f2b40]">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="w-12 h-12 border-4 border-[#1f2b40] border-t-[#22c55e] rounded-full animate-spin"></div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white tracking-[0.3em]">Loading</p>
          </div>
        </div>
      </div>
    </div>
  );
};
