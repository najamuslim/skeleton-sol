function handleLog(...args: unknown[]) {
  console.log(...args);
}

const log = {
  green: (...args: unknown[]) =>
    handleLog("%c" + args[0], "color: green", ...args.slice(1)),
  info: (...args: unknown[]) => handleLog(...args),
};

export default log;
