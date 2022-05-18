import { createContext, useState, useRef, useEffect } from "react";
import { throttle } from '../utils/throttle'

export const TrackContext = createContext();

export function TrackProvider({ children }) {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const player = useRef();

  useEffect(() => {
    const saveCurrentTrack = throttle(({ detail }) => {
      if(detail.plyr.playing) {
        const payload = {
          id: selectedTrack.id,
          currentTime: detail.plyr.currentTime
        }
        localStorage.setItem('lastPlayedTrackInfo', JSON.stringify(payload))
      }
    }, 1000)

    if (selectedTrack && player && player.current) {
      const { plyr } = player.current
      plyr.on('timeupdate', saveCurrentTrack)
    }
    return () => {
      if (player && player.current) {
        const { plyr  } = player.current
        plyr.off('timeupdate')
        localStorage.setItem('lastPlayedTrackInfo', '')
      }
    }
  }, [selectedTrack, player, player.current])

  return (
    <TrackContext.Provider value={{ selectedTrack, setSelectedTrack, player }}>
      {children}
    </TrackContext.Provider>
  );
}
