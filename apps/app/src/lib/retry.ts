const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Runs an attempt until it succeeds, waiting each delay between tries; false when they run out.
export async function retryWithDelays(
  attempt: () => Promise<boolean>,
  delays: number[],
  wait: (ms: number) => Promise<void> = sleep,
): Promise<boolean> {
  if (await attempt()) return true;
  for (const delay of delays) {
    await wait(delay);
    if (await attempt()) return true;
  }
  return false;
}
