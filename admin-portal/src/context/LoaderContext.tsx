import React, { createContext, useContext, useState, type ReactNode } from "react";

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

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);
  const setLoading = (loading: boolean) => setIsLoading(loading);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader, setLoading }}>
      {children}
      {isLoading && <Loader />}
    </LoaderContext.Provider>
  );
};

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-cyan-600 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    </div>
  );
};