import React, { createContext, useState, useContext, useEffect } from 'react';

const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [layout, setLayout] = useState(() => {
    return localStorage.getItem('portfolio-layout') || 'professional';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-layout', layout);
    document.body.className = `layout-${layout}`;
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};