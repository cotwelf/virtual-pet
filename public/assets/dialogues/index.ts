import { happy } from "./happy";

export type IBtnConfig = {
  text: string
}
export type IDialogueItem = {
  text: string
  btn1: IBtnConfig,
  btn2: IBtnConfig,
  showed: boolean,
}

export const dialoguesAssets = {
  happy: {
    score: [7, 10], // from 7 to 10
    dialogue: happy,
  }
}
