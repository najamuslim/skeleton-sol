function handleLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

const log = {
  green: (...args: unknown[]) =>
    handleLog("%c" + args[0], "color: green", ...args.slice(1)),
  info: (...args: unknown[]) => handleLog(...args),
};

export default log;
