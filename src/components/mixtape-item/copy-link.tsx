"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export const CopyLinkButton = ({ url }: { url: string }) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (clicked) {
      setTimeout(() => {
        setClicked(false);
      }, 1000);
    }
  }, [clicked]);

  return (
    <Button
      type="button"
      variant="text"
      onClick={() => {
        navigator.clipboard.writeText(url);
        setClicked(true);
      }}
      className="hover:text-[#1500FF]"
    >
      {clicked ? "Copied" : "Get Url"}
    </Button>
  );
};
