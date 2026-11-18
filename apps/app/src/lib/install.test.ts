import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chromeIntent, installGuide } from "./install.ts";

const UA = {
  safari26:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
  safari18:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
  iosChrome:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0.0.0 Mobile/15E148 Safari/604.1",
  iosFirefox:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/145.0 Mobile/15E148 Safari/605.1.15",
  iosInstagram:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 400.0.0.0.0",
  iPadAsMac:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
  androidChrome:
    "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
  androidInstagram:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP1A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.0.0 Mobile Safari/537.36 Instagram 400.0.0.0.0 Android",
  androidFacebook:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/142.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0.0.0;]",
};

describe("installGuide", () => {
  it("tells Safari 26 apart from older Safari", () => {
    assert.deepEqual(installGuide(UA.safari26), { kind: "ios-safari", modern: true });
    assert.deepEqual(installGuide(UA.safari18), { kind: "ios-safari", modern: false });
  });

  it("treats other iOS browsers as ios-other", () => {
    assert.deepEqual(installGuide(UA.iosChrome), { kind: "ios-other" });
    assert.deepEqual(installGuide(UA.iosFirefox), { kind: "ios-other" });
  });

  it("detects in-app browsers on both platforms", () => {
    assert.deepEqual(installGuide(UA.iosInstagram), {
      kind: "in-app",
      app: "Instagram",
      os: "ios",
    });
    assert.deepEqual(installGuide(UA.androidInstagram), {
      kind: "in-app",
      app: "Instagram",
      os: "android",
    });
    assert.deepEqual(installGuide(UA.androidFacebook), {
      kind: "in-app",
      app: "Facebook",
      os: "android",
    });
  });

  it("treats an iPad reporting as a Mac as iOS", () => {
    assert.deepEqual(installGuide(UA.iPadAsMac, true), { kind: "ios-safari", modern: true });
  });

  it("falls back to android elsewhere", () => {
    assert.deepEqual(installGuide(UA.androidChrome), { kind: "android" });
  });
});

describe("chromeIntent", () => {
  it("keeps host, path and query", () => {
    assert.equal(
      chromeIntent("https://app.door.link/?install"),
      "intent://app.door.link/?install#Intent;scheme=https;package=com.android.chrome;end",
    );
  });
});
