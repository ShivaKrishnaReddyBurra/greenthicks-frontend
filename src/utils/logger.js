export const logDebug = (...args) => {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[DEBUG]", ...args);
  }
};
