export const filmVersion = false // 用于交作业 orz
export const testScenes: string = '' // 当前测试哪个 scene，默认 ''
export const englishVer = false
export const bgmOn = true // true：打开 bgm；false：关闭 bgm
export const daysDuration = 20000 // 每天持续时间，默认 180000, 测试 3000
export const leisureDuration = 30000 // 超过闲置时间，开启下一阶段，或开启自动对话，默认 60000
export const fastGameDuration = 10000 // 快速体验时间
export let isFastGame = false // 是否开启快速体验
export const amplifyScale = {
  dialogue: 5, // 对白文字缩放
  space: 2.5 // space scale
} // 屏幕缩放

// scene: text
export const fastPrintDays = filmVersion && false // n 天后，主要用于交作业 orz 转场用（一行转场）
export const fastPrintDaysMulti = filmVersion && false // 第 x 天，多行转场
export const printLoop = filmVersion && false

// scene: covid
export const covidBgmOn = true
