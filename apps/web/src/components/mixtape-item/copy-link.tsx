"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const CopyLinkButton = ({ url }: { url: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (error) {
      console.error("Copy link error:", error);
    }
  };

  return (
    <Button type="button" variant="text" onClick={handleClick} className="hover:text-[#1500FF]">
      {copied ? "Copied" : "Get Url"}
    </Button>
  );
};
