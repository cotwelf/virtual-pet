export enum LOCALSTORAGE_ITEM {
  LAST_LOGIN_DATE = 'last-login-date', // 上次登录日期
  CHARACTER_KEY = 'character-key', // 选择的角色
  BASIC_DATA = 'basic-data', // 基础数据
  EVENT_DAILY_RECORD = 'event-daily-record', // 日常事件
  EVENT_DURABLE_RECORD = 'event-durable-record', // 持续事件
  EVENT_CRASH_RECORD = 'event-crash-record', // 突发事件
  INTERACT_TIMES = 'interact-times' // 互动次数
}

export const getCharacterKey = () => {
  let data = ''
  try {
    data = JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.CHARACTER_KEY) ?? '')
  } catch (e) {
    // PASS
  }
  console.log(JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM.CHARACTER_KEY) ?? ''), data,'data')
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
  console.log(data,'data')
  return data
}
export const setBasicData = (basicData: object) => {
  try {
    localStorage.setItem(LOCALSTORAGE_ITEM.BASIC_DATA, JSON.stringify(basicData))
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