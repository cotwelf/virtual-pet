export type IData = {
  characterKey: 'girl' | 'boy'
  basicData: {
    "health":5,
    "feeling":5,
    "knowledge":5,
    "relationship":5
  },
  eventDurableRecord:[],
  eventCrashRecord:[],
  interactTimes: number,
  lastChangeTime: number,
  dayCounter: number
}
const data = {
  characterKey: "girl", // girl, body
  basicData: {
    "health":5, // 健康值为 0 时游戏结束
    "feeling":5,
    "knowledge":5,
    "relationship":5
  },
  eventDailyRecord: {
    covid: false,
  },
  eventDurableRecord:[],
  eventCrashRecord:[],
  interactTimes:5,
  lastChangeTime:1665195234327,
  dayCounter: 0
}

export const getData = () => data

export const setData = (key, value) => {
  data[key] = value
  return data
}
