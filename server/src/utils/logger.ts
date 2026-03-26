import util from "util";
import { addColors, createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const customColors = {
  info: "blue",
  error: "red",
  warn: "yellow",
  debug: "green",
};

addColors(customColors);

const logFormat = printf(({ level, message, timestamp, context, ...meta }) => {
  const metaString =
    Object.keys(meta).length > 0
      ? ` ${util.inspect(meta, { depth: null, colors: false })}`
      : "";

  return `${timestamp} ${level.toUpperCase()}${
    context ? ` [${context}]` : ""
  } ${message}${metaString}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    combine(colorize({ all: true }), logFormat),
  ),
  transports: [new transports.Console()],
});

export default logger;
