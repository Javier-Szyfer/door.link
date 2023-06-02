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
        <div className="flex mt-7  lg:mt-12">
          <p>
            A curated selection of music for listening and dancing in closed
            spaces.
            <span
              onClick={handleInfo}
              className="text-[#1500FF] dark:text-[#84858C] whitespace-nowrap ml-2 cursor-pointer"
            >
              [ more ]
            </span>
          </p>
        </div>
      ) : (
        <div className="mt-7 lg:mt-12">
          <p>
            At the end of the 90s, we ripped albums that we found in physical
            stores and <i> took them to the internet.</i> It was during this era
            that we built a content channel with a noble purpose, that of
            listening. Soulseek's directories were cities and “emigrate to a new
            land” was a common feeling. Back then, connecting to the Internet
            required a desktop computer, a good local provider, modem, and time.{" "}
            <br /> <br /> Life was concretely and cybernetically constituted,a
            division that no longer exists and -without automatic playlists or
            advertising- finding material was the product of research so the
            user was, at the very least, selective. With free internet on the
            streets and the advent of the smartphone, the latest generations are
            now easy recipients of unrequested information. All this, before
            touching a wire or having a thoughtful moment. <br />
            <br />
            Curated by
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.romi.link"
            >
              <span className="text-[#1500FF] dark:text-[#84858C] hover:underline cursor-pointer">
                {" "}
                romi
              </span>
            </a>
            , door is a music selection for listening and dancing in closed
            spaces.
            <span
              onClick={handleInfo}
              className="text-[#1500FF] dark:text-[#84858C] whitespace-nowrap ml-2 cursor-pointer"
            >
              [ less ]
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
