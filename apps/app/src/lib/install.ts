export type InstallGuide =
  | { kind: "android" }
  | { kind: "ios-safari"; modern: boolean }
  | { kind: "ios-other" }
  | { kind: "in-app"; app: string; os: "ios" | "android" };

const IN_APP_BROWSERS: [RegExp, string][] = [
  [/Instagram/, "Instagram"],
  [/FBAN|FBAV|FB_IAB/, "Facebook"],
  [/musical_ly|BytedanceWebview|TikTok/, "TikTok"],
  [/Snapchat/, "Snapchat"],
  [/LinkedInApp/, "LinkedIn"],
  [/Twitter/, "X"],
  [/\bLine\//, "LINE"],
];

// Which install steps fit this browser; touchMac flags an iPad that reports itself as a Mac.
export function installGuide(userAgent: string, touchMac = false): InstallGuide {
  const ios = /iPhone|iPad|iPod/.test(userAgent) || touchMac;
  const os = ios ? "ios" : "android";

  for (const [pattern, app] of IN_APP_BROWSERS) {
    if (pattern.test(userAgent)) return { kind: "in-app", app, os };
  }

  if (!ios) return { kind: "android" };

  const safari = userAgent.match(/Version\/(\d+)[\d.]* .*Safari/);
  if (safari && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(userAgent)) {
    return { kind: "ios-safari", modern: Number(safari[1]) >= 26 };
  }
  return { kind: "ios-other" };
}

// An Android link that opens `url` in Chrome instead of the current in-app browser.
export function chromeIntent(url: string): string {
  const { protocol, host, pathname, search } = new URL(url);
  return `intent://${host}${pathname}${search}#Intent;scheme=${protocol.slice(0, -1)};package=com.android.chrome;end`;
}
