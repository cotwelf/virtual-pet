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
let data = {
  characterKey: "girl-sleep", // girl, body // 录像：girl-emo, girl-game, girl-sleep
  basicData: {
    "feeling":6,
    "health":0, // 健康值为 0 时游戏结束
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
  dayCounter: 1
}

export const getData = () => data

export const setData = (value) => {
  data = value
  return data
}
