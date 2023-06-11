import { Component } from "react";

import { getAllMixtapes } from "../app/lib/getAllMixtapes";

declare global {
  interface String {
    encodeXML(): string;
  }
}

if (!String.prototype.encodeXML) {
  String.prototype.encodeXML = function () {
    return this.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };
}

const TagWriter = (writer) => ({
  write: (tag, attrs, content, indent = 0, isVoid = false) => {
    const tab = "  ".repeat(indent);
    writer.write(`${tab}<${tag}`);
    if (Object.entries(attrs).length > 0)
      writer.write(
        " " +
          Object.keys(attrs)
            .map((key) => `${key}="${attrs[key]}"`)
            .join(" ")
      );
    if (isVoid) writer.write(` />\n`);
    else writer.write(`>${content ? content.encodeXML() : ""}</${tag}>\n`);
  },
  open: (tag, attrs = {}, indent = 0) => {
    const tab = "  ".repeat(indent);
    writer.write(`${tab}<${tag}`);
    if (Object.entries(attrs).length > 0)
      writer.write(
        " " +
          Object.keys(attrs)
            .map((key) => `${key}="${attrs[key]}"`)
            .join(" ")
      );
    writer.write(">\n");
  },
  close: (tag, indent = 0) => {
    const tab = "  ".repeat(indent);
    writer.write(`${tab}</${tag}>\n`);
  },
});

export default class RSS extends Component {
  static async getInitialProps({ res }) {
    const tag = TagWriter(res);

    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
    tag.open("rss", {
      version: "2.0",
      "xmlns:atom": "http://www.w3.org/2005/Atom",
    });

    // Channel information.
    tag.open("channel");
    tag.write("title", {}, "[ door ]", 1);
    tag.write(
      "description",
      {},
      "A curated selection of music for listening" +
        " and dancing in small, safe spaces.",
      1
    );
    tag.write("language", {}, "en-us", 1);
    tag.write("link", {}, "https://door.link/rss.xml", 1);
    tag.write(
      "atom:link",
      {
        href: "https://door.link/rss.xml",
        rel: "self",
        type: "application/rss+xml",
      },
      null,
      1,
      true
    );
    // Generate entries.
    const entries = await getAllMixtapes();
    for (const entry of entries) {
      const { audio } = entry;
      // Convert ISO8601 date string to RFC822.
      const date = new Date(Date.parse(entry._createdAt));
      tag.open("item", {}, 1);
      tag.write("title", {}, entry.title, 2);
      tag.write("guid", { isPermaLink: false }, audio.hash, 2);
      tag.write("link", {}, "https://door.link/", 2);
      tag.write(
        "enclosure",
        {
          url: audio.url,
          type: audio.mimeType,
          length: Math.trunc(audio.size * 1000),
        },
        null,
        2,
        true
      );
      // Description tag must be encoded twice, first as HTML, then as XML.
      tag.write("description", {}, entry.description.trim().encodeXML(), 2);
      tag.write("pubDate", {}, date.toUTCString(), 2);
      tag.close("item", 1);
    }
    // Close remaining tags.
    tag.close("channel");
    tag.close("rss");
    res.end();
  }
}
