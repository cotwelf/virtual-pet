import { IBasicData } from '~/utils/types';

// export enum LOCALSTORAGE_ITEM {
//   LAST_CHANGE_TIME = 'last-change-time', // 上次数据改变的时间（每日登录，事件触发，基础数据变化
//   CHARACTER_KEY = 'character-key', // 选择的角色
//   BASIC_DATA = 'basic-data', // 基础数据
//   EVENT_DAILY_RECORD = 'event-daily-record', // 日常事件
//   EVENT_DURABLE_RECORD = 'event-durable-record', // 持续事件
//   EVENT_CRASH_RECORD = 'event-crash-record', // 突发事件
//   INTERACT_TIMES = 'interact-times' // 互动次数
// }

export const LOCALSTORAGE_ITEM = 'VIRTUAL_PET_STORAGE'
export interface IEventDailyRecord {
  covid: boolean
  food: boolean
}
type ISetStorageDataKeys = 'lastChangeTime' | 'characterKey' | 'basicData' | 'eventDailyRecord' | 'eventDurableRecord'
                            | 'eventCrashRecord' | 'interactTimes'
export interface IStorageData {
  lastChangeTime?: number // 上次数据改变的时间（每日登录，事件触发，基础数据变化
  characterKey?: string // 选择的角色
  basicData?: {
    health: number
    feeling: number
    knowledge: number
    relationship: number
  } // 基础数据
  eventDailyRecord?: {
    covid: boolean // 是否核酸
    food: boolean // 是否抢菜
  }
  eventDurableRecord?: any // 持续事件
  eventCrashRecord?: any // 突发事件
  interactTimes?: number // 今日互动次数
}

export const getStorageData = () => {
  let data : IStorageData = {}
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM) ?? '{}')
  } catch (e) {
    // PASS
  }
  return data
}

export const setStorageData = (key: ISetStorageDataKeys, value: any) => {
  let storageData = getStorageData()
  storageData = {
    ...storageData,
    [key]: value,
  }
  console.log(storageData)
    try {
      localStorage.setItem(LOCALSTORAGE_ITEM, JSON.stringify(storageData))
    } catch (e) {
      // PASS
    }
}
// 初始化当日数值
export const updateStorageData = function() {
  let storageData = getStorageData()
  const now = new Date()
  const lastDate = storageData?.lastChangeTime ? new Date(storageData.lastChangeTime) : now
  const lastString = `${lastDate.getFullYear()}/${lastDate.getMonth() + 1}/${lastDate.getDate()}`
  const todayString = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
  if (lastString !== todayString) {
    // 每日首次登录
    // lastChangeTime 改为今日
    storageData.lastChangeTime = now.valueOf()
  }
  // 30 分钟有 0.5 概率切换一次状态
  const duration = 30 * 60 * 60 * 1000
  // const changeStatus = (storageData.lastChangeTime - now.valueOf()) > duration

  // 如果距离上次改变状态过了半小时，则
  // if (changeStatus) {
  //   // 查看当日进行过的事件
  //   getInteractTimes()
  // }
  // 记录更新数据的时间
  // setLastChangeTime(Date.now())
  return {
    // remainTime: duration - lastChangeTime + now.valueOf() // 用于倒计时，计时结束后添加事件
  }
}
