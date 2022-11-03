export const filmVersion = true // 用于交作业 orz
export const testScenes: string = 'text' // 当前测试哪个 scene
export const bgmOn = false // true：打开 bgm；false：关闭 bgm
export const daysDuration = 30000000 // 每天持续时间

// scene: text
export const fastPrintDays = filmVersion && false // n 天后，主要用于交作业 orz 转场用（一行转场）
export const fastPrintDaysMulti = filmVersion && false // 多行转场
export const printLoop = filmVersion && false

// scene: covid
export const covidBgmOn = false


// export const textData = {
//   characterKey:"girl",
//   basicData:{
//     "health":0,
//     "feeling":0,
//     "knowledge":5,
//     "relationship":5
//   },
//   eventDailyRecord:{
//     "covid":true,
//     "food":0
//   },
//   eventDurableRecord:[],
//   eventCrashRecord:[],
//   interactTimes:5,
//   lastChangeTime:1665195234327,
//   dayCounter: 1
// }
