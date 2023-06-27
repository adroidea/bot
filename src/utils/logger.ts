import ansis, { AnsiColors } from "ansis";
import dayjs from "dayjs";

const format = "{tstamp} : {tag} {txt} \n";

export default class Logger {
  private static write(
    content: string,
    tagColor: AnsiColors,
    bgTagColor: AnsiColors,
    tag: string,
    error = false
  ) {
    const timestamp = `[${dayjs().format("DD/MM - HH:mm:ss")}]`;
    const logTag = `[${tag}]`;
    const stream = error ? process.stderr : process.stdout;
    const item = format
      .replace("{tstamp}", ansis.red(timestamp))
      .replace("{tag}", ansis[bgTagColor][tagColor](logTag))
      .replace("{txt}", ansis.white(content));
    stream.write(item);
  }

  static error(content: string, error: Error, filePath?: string) {
    Logger.write(`${content} \n${filePath}`, "black", "bgRed", "ERROR", true);
    console.error(error);
  }

  static warn(content: string) {
    Logger.write(content, "black", "bgYellow", "WARN", false);
  }

  static info(content: string) {
    Logger.write(content, "black", "bgGreen", "INFO", false);
  }

  static client(content: string) {
    Logger.write(content, "black", "bgBlue", "CLIENT", false);
  }
}
