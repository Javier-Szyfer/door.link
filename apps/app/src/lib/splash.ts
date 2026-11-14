const IPHONES = [
  { width: 440, height: 956, ratio: 3 },
  { width: 430, height: 932, ratio: 3 },
  { width: 428, height: 926, ratio: 3 },
  { width: 420, height: 912, ratio: 3 },
  { width: 414, height: 896, ratio: 3 },
  { width: 414, height: 896, ratio: 2 },
  { width: 414, height: 736, ratio: 3 },
  { width: 402, height: 874, ratio: 3 },
  { width: 393, height: 852, ratio: 3 },
  { width: 390, height: 844, ratio: 3 },
  { width: 375, height: 812, ratio: 3 },
  { width: 375, height: 667, ratio: 2 },
  { width: 320, height: 568, ratio: 2 },
];

// The launch image file of each iPhone screen, in device pixels.
export const splashFiles = () =>
  IPHONES.map(({ width, height, ratio }) => {
    const [w, h] = [width * ratio, height * ratio];
    return { path: `/splash/${w}x${h}.png`, width: w, height: h };
  });

// The launch images iOS shows while the installed app opens.
export const splashImages = () =>
  IPHONES.map(({ width, height, ratio }) => ({
    url: `/splash/${width * ratio}x${height * ratio}.png`,
    media: `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
  }));
