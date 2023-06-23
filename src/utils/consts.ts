import { ColorResolvable } from "discord.js";
import { getRandomRGB } from "./botUtil";

export const Colors: { [key: string]: ColorResolvable } = {
  error: [255, 0, 0],
  success: [0, 255, 0],
  warning: [255, 255, 0],
  red: [176, 32, 32],
  random: getRandomRGB()
};
