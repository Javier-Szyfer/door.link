"use client";
import { useState } from "react";

export const Description = () => {
  const [fullDescription, setFullDescription] = useState(false);

  const handleInfo = () => setFullDescription((full) => !full);

  return (
    <div className="max-w-[18rem] sm:max-w-[60rem]">
      {!fullDescription ? (
        <div className="mt-7 flex lg:mt-12">
          <p>
            A handpicked music selection, grown over time, algorithm-free, made for listening and
            dancing.
            <button
              type="button"
              onClick={handleInfo}
              className="ml-2 cursor-pointer whitespace-nowrap text-[#1500FF] dark:text-[#84858C]"
            >
              [ more ]
            </button>
          </p>
        </div>
      ) : (
        <div className="mt-7 lg:mt-12">
          <p>
            In the late ’90s we ripped albums we found in physical stores and shared them online.
            Around that time, we built channels around a simple purpose: listening. Soulseek’s
            directories felt like cities, and <i>“emigrating to a new land”</i> was a common
            feeling. Connecting to the internet back then required a desktop computer, a solid local
            provider, a modem and a good dose of patience. <br /> <br /> Life was split between
            offline and online realities, a division that no longer really exists. Without automatic
            playlists or ads, discovering music required deliberate searching, which made the
            listener, at the very least, selective. Today, technological advances have turned us
            into passive recipients of unsolicited content. Music is no exception. It reaches us
            before we’ve even plugged in or taken a moment to actually pay attention. <br />
            <br />
            Created by{" "}
            <a target="_blank" rel="noopener noreferrer" href="https://www.romi.link">
              <span className="cursor-pointer text-[#1500FF] hover:underline dark:text-[#84858C]">
                Romina Malta
              </span>
            </a>{" "}
            on Mixcloud in 2014, Door became independent in 2020 and took on a new name: door.link.
            <button
              type="button"
              onClick={handleInfo}
              className="ml-2 cursor-pointer whitespace-nowrap text-[#1500FF] dark:text-[#84858C]"
            >
              [ less ]
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
