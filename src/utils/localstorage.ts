import { IBasicData } from '~/utils/types';

export enum LOCALSTORAGE_ITEM {
  LAST_LOGIN_TIME = 'last-login-time', // 上次登录时间
  CHARACTER_KEY = 'character-key', // 选择的角色
  BASIC_DATA = 'basic-data', // 基础数据
  EVENT_DAILY_RECORD = 'event-daily-record', // 日常事件
  EVENT_DURABLE_RECORD = 'event-durable-record', // 持续事件
  EVENT_CRASH_RECORD = 'event-crash-record', // 突发事件
  INTERACT_TIMES = 'interact-times' // 互动次数
}
export interface IEventDailyRecord {
  covid: boolean
  food: boolean
}

// WORKAROUND: 不知道需不需要放到一起，之后有需要再说8
// export interface IAllData {
//   [LOCALSTORAGE_ITEM.LAST_LOGIN_TIME]: number
//   [LOCALSTORAGE_ITEM.CHARACTER_KEY]: string
//   [LOCALSTORAGE_ITEM.BASIC_DATA]: IBasicData
//   [LOCALSTORAGE_ITEM.EVENT_DAILY_RECORD]: {
//     covid: boolean
//     food: boolean
//   }
//   [LOCALSTORAGE_ITEM.EVENT_DURABLE_RECORD]: any
//   [LOCALSTORAGE_ITEM.EVENT_CRASH_RECORD]: any
//   [LOCALSTORAGE_ITEM.INTERACT_TIMES]: number
// }


// 初始化当日数值
export const getDataAndSetStatus = () => {
  let lastChangeTime = getLastChangeTime()
  const now = Date.now()
  if (!lastChangeTime) {
    lastChangeTime = now
    setLastChangeTime(Date.now())
  }

  // 30 分钟有 0.5 概率切换一次状态
  const duration = 30 * 60 * 60 * 1000
  const changeStatus = (lastChangeTime - now) > duration
  const lastDate = new Date(lastChangeTime)
  console.log(lastChangeTime,`${lastDate.getFullYear()}/${lastDate.getMonth() + 1}/${lastDate.getDate()}`)
  // 如果距离上次改变状态过了半小时，则
  if (changeStatus) {
    // 查看当日进行过的事件
    getInteractTimes()
  }
  // 记录更新数据的时间
  // setLastChangeTime(Date.now())
  return {
    remainTime: duration - lastChangeTime + now // 用于倒计时，计时结束后添加事件
  }
}

export const getLastChangeTime = () => {
  let data = 0
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.LAST_LOGIN_TIME) ?? '')
  } catch (e) {
    // PASS
  }
  return data
}
export const setLastChangeTime = (ts: number) => {
  try {
    localStorage.setItem(LOCALSTORAGE_ITEM.LAST_LOGIN_TIME, JSON.stringify(ts))
  } catch (e) {
    // PASS
  }
}

export const getCharacterKey = () => {
  let data = ''
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.CHARACTER_KEY) ?? '')
  } catch (e) {
    // PASS
  }
  return data
}
export const setCharacterKey = (key: string) => {
  try {
    localStorage.setItem(LOCALSTORAGE_ITEM.CHARACTER_KEY, JSON.stringify(key))
  } catch (e) {
    // PASS
  }
}

export const getBasicData = () => {
  let data = null
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.BASIC_DATA) || '')
  } catch (e) {
    // PASS
  }
  return data
}
export const setBasicData = (basicData: object) => {
  try {
    localStorage.setItem(LOCALSTORAGE_ITEM.BASIC_DATA, JSON.stringify(basicData))
  } catch (e) {
    // PASS
  }
}

export const getEventDailyRecord = () => {
  let data = []
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.EVENT_DAILY_RECORD) || '[]')
  } catch (e) {
    // PASS
  }
  return data
}
export const setEventDailyRecord = (event: IEventDailyRecord) => {
  try {
    localStorage.setItem(LOCALSTORAGE_ITEM.BASIC_DATA, JSON.stringify(event))
  } catch (e) {
    // PASS
  }
}

export const getInteractTimes = () => {
  let data = 0
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.INTERACT_TIMES) || '')
  } catch (e) {
    // PASS
  }
  return data
}
export const setInteractTimes = (times: number) => {
  try {
    localStorage.setItem(LOCALSTORAGE_ITEM.INTERACT_TIMES, JSON.stringify(times))
  } catch (e) {
    // PASS
  }
}
