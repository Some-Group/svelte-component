export function formatStyle(obj: Record<string, any> | string = {}) {
  if (typeof obj === "string") return obj;
  return Object.keys(obj)
    .reduce((style, key) => {
      const value = obj[key];
      if (value === null || value === undefined) {
        return style;
      }
      const unit =
        typeof value === "number" &&
        /width|height|top|right|buttom|left/i.test(key)
          ? "px"
          : "";
      return style.concat(
        `${key.replace(
          /([A-Z])/,
          (a) => `-${a.toLowerCase()}`
        )}:${value}${unit}`
      );
    }, [])
    .join(";");
}
