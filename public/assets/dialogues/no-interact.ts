import { getKotoba } from "~/utils/api";
import { random } from "lodash";

const RANDOM_BTNS = [
  { text: "没人理我qwq" },
  { text: "戳一下" }
]
const RANDOM_DIALOGUES = [
  "好像没有人理我了呢。。。。。。",
]
export const getNoInteractDialogues = () => {
  return getKotoba().then((res) => {
    console.log(res,'res')
    return {
      dialogue: res,
      btns: RANDOM_BTNS
    }
  }).catch(() => {
    return {
      dialogue: RANDOM_DIALOGUES[0],
      btns: RANDOM_BTNS
    }
  })
}
