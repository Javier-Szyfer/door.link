"use client";
import { useState } from "react";

export const Description = () => {
  const [fullDescription, setFullDescription] = useState(false);

  const handleInfo = () => {
    setFullDescription(!fullDescription);
  };

  return (
    <div className="max-w-[18rem] sm:max-w-[60rem]">
      {!fullDescription ? (
        <div className="mt-7 flex lg:mt-12">
          <p>
            A handpicked music selection, grown over time, algorithm-free, made for listening and
            dancing.
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <span
              onClick={handleInfo}
              className="ml-2 cursor-pointer whitespace-nowrap text-[#1500FF] dark:text-[#84858C]"
            >
              [ more ]
            </span>
          </p>
        </div>
      ) : (
        <div className="mt-7 lg:mt-12">
          <p>
            In the late 90s, we ripped albums we found in physical stores and and shared them on the
            net. Around that time, we built a content channel with a noble purpose: listening.
            Soulseek&apos;s directories felt like cities, and <i>“emigrating to a new land”</i> was
            a common feeling. Connecting to the internet back then required a desktop computer, a
            solid local provider, a modem, and a good dose of patience. <br /> <br /> Life was split
            between offline and online realities, a division that no longer exists. Without
            automatic playlists or ads, discovering music was the result of deliberate research,
            which made the listener, at the very least, selective. Today, technological advances
            make us passive recipients of unsolicited content—and music is no exception. All of it
            arrives before we&apos;ve even plugged in or taken a moment to truly pay attention.{" "}
            <br />
            <br />
            Curated by
            <a target="_blank" rel="noopener noreferrer" href="https://www.romi.link">
              <span className="cursor-pointer text-[#1500FF] hover:underline dark:text-[#84858C]">
                {" "}
                romi
              </span>
            </a>
            , door.link is a handpicked music selection, grown over time, algorithm-free, made for
            listening and dancing.
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
            <span
              onClick={handleInfo}
              className="ml-2 cursor-pointer whitespace-nowrap text-[#1500FF] dark:text-[#84858C]"
            >
              [ less ]
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
