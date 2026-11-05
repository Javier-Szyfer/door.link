import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { OG_IMAGE } from "../constants/metadata.ts";
import { mixtapeOgImage } from "./mixtape-og-image.ts";

describe("mixtapeOgImage", () => {
  it("uses the mixtape cover", () => {
    const url = "https://media.keyholemedia.store/images/door-214.jpeg";
    assert.deepEqual(mixtapeOgImage(url), { url });
  });

  it("falls back to the keyhole image without a usable cover", () => {
    for (const uri of [undefined, null, "", "images/door-214.jpeg"]) {
      assert.equal(mixtapeOgImage(uri), OG_IMAGE);
    }
  });
});
