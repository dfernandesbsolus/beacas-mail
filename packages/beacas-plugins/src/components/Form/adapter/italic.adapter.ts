export const italicAdapter = {
  formatter(fontStyle: string): boolean {
    const val = fontStyle;

    return val === "italic";
  },
  normalize(active: boolean): string | undefined {
    if (!active) return undefined;

    return "italic";
  },
};
