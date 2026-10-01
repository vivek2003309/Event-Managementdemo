import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextType {
  introCompleted: boolean;
  setIntroCompleted: (completed: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType>({
  introCompleted: false,
  setIntroCompleted: () => {},
});

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [introCompleted, setIntroCompleted] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hasSeenPreloader') === 'true';
    } catch (e) {
      return false;
    }
  });

  return (
    <AnimationContext.Provider value={{ introCompleted, setIntroCompleted }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);
