export type HomeView = "grid" | "list";

// Reads a stored home view, defaulting to the grid.
export const parseHomeView = (value: string | null): HomeView =>
  value === "list" ? "list" : "grid";

// Whether home can render its final layout at once instead of growing piece by piece.
export const homeReady = ({
  libraryLoaded,
  loading,
  mixCount,
}: {
  libraryLoaded: boolean;
  loading: boolean;
  mixCount: number;
}) => libraryLoaded && (mixCount > 0 || !loading);
