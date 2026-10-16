import { createContext, useContext, useState, type ReactNode } from "react";

type SplashContextValue = {
  splashFinished: boolean;
  setSplashFinished: (finished: boolean) => void;
};

const SplashContext = createContext<SplashContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function SplashProvider({ children }: Props) {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <SplashContext.Provider
      value={{
        splashFinished,
        setSplashFinished,
      }}
    >
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  const context = useContext(SplashContext);

  if (!context) {
    throw new Error("useSplash must be used inside SplashProvider");
  }

  return context;
}
