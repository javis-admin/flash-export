import React, { createContext, useContext } from "react";

const FlashExportContext = createContext();

export const FlashExportProvider = ({ children, value }) => {
  return (
    <FlashExportContext.Provider value={value}>
      {children}
    </FlashExportContext.Provider>
  );
};

export const useFlashExport = () => {
  const context = useContext(FlashExportContext);
  if (!context) {
    throw new Error("useFlashExport must be used within a FlashExportProvider");
  }
  return context;
};
