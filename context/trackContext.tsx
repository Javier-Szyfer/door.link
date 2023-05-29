import { createContext, useState } from "react";

export const TrackContext = createContext({} as any);

export function TrackProvider({ children }) {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <TrackContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </TrackContext.Provider>
  );
}
