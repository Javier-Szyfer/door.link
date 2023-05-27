import { useState, useEffect, useContext } from "react";
import { TrackContext } from "../context/trackContext";

import Link from "next/link";
import Image from "next/image";

import { useTheme } from "next-themes";

//Components
import Subscribers from "./subscribers";

export default function Header() {
  const { selectedTrack } = useContext(TrackContext);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [fullDescription, setFullDescription] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const handleInfo = () => {
    setFullDescription(!fullDescription);
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col px-4 text-sm text-[rgb(68,68,68)] dark:text-[#f1f1f1]">
      <div className="flex justify-between pt-6 lg:pt-12  ">
        <h1 className="font-semibold">[ door ]</h1>
        {!selectedTrack && (
          <Image
            src={theme === "dark" ? "/logowhite.svg" : "/logoblack.svg"}
            className="cursor-pointer p-[3px]"
            width={16}
            height={16}
            alt="door.link-logo"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          />
        )}
      </div>
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
              stores and <i> took them to the internet.</i> It was during this
              era that we built a content channel with a noble purpose, that of
              listening. Soulseek's directories were cities and “emigrate to a
              new land” was a common feeling. Back then, connecting to the
              Internet required a desktop computer, a good local provider,
              modem, and time. <br /> <br /> Life was concretely and
              cybernetically constituted,a division that no longer exists and
              -without automatic playlists or advertising- finding material was
              the product of research so the user was, at the very least,
              selective. With free internet on the streets and the advent of the
              smartphone, the latest generations are now easy recipients of
              unrequested information. All this, before touching a wire or
              having a thoughtful moment. <br />
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
        <div className="py-6 lg:py-9 flex space-x-3 text-[#1500FF] dark:text-[#84858C]">
          <h2 onClick={() => setShowForm(true)} className="cursor-pointer">
            Subscribe
          </h2>
          <a target="_blank" rel="noopener noreferrer" href="/rss.xml">
            <h2>RSS</h2>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://urbit.org/groups/~natnex-ronret/door-link"
          >
            <h2>Urbit</h2>
          </a>
          <Link href="mailto:contact@door.link">
            <h2>Contact</h2>
          </Link>
        </div>
      </div>
      {showForm && <Subscribers setShowForm={setShowForm} />}
    </div>
  );
}
