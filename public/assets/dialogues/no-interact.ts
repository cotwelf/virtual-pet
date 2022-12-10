import { getKotoba } from "~/utils/api";
import { random } from "lodash";

const RANDOM_BTNS = ['确实', '没戳']
const RANDOM_DIALOGUES = [
  "好像没有人理我了呢。。。。。。",
]
export const getNoInteractDialogues = () => {
  return getKotoba().then((res) => {
    console.log(res,'res')
    return {
      text: res,
      btn1: {
        text: "确实"
      },
      btn2: {
        text: "戳一下"
      },
      showed: false,
    }
  }).catch(() => {
    return {
      text: RANDOM_DIALOGUES[0],
      btn1: {
        text: "确实"
      },
      btn2: {
        text: "没戳"
      },
      showed: false,
    }
  })
}
