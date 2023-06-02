"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useState } from "react";

export const TrackContext = createContext({} as any);

export function Providers({ children }) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <ThemeProvider attribute="class">
      <TrackContext.Provider value={{ selectedTrack, setSelectedTrack }}>
        {children}
      </TrackContext.Provider>
    </ThemeProvider>
  );
}
