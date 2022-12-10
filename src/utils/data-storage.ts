export type IData = {
  characterKey: 'girl' | 'boy'
  characterStatus: string[]
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
  characterKey: "girl", // girl, body // 录像：girl-emo, girl-game, girl-sleep
  characterStatus: ['', 'emo', 'game', 'sleep'],
  basicData: {
    "feeling":10,
    "health":10, // 健康值为 0 时游戏结束
    "knowledge":10,
    "relationship":10
  },
  eventDailyRecord: {
    covid: false,
  },
  eventDurableRecord:[],
  eventCrashRecord:[],
  interactTimes:0,
  lastChangeTime:1665195234327,
  dayCounter: 1
}

export const getData = () => data

export const setData = (value) => {
  data = value
  return data
}
