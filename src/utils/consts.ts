import { IBasicData } from "./types"

export const dayAndDay = 3000 // 天和天之间的间隔

export enum CharacterKeys {
  Girl = 'girl',
  Boy = 'boy',
}

export const CEILING = 10

export const DATA_TYPES: IBasicData[] = ['health', 'feeling', 'knowledge', 'relationship']

export const CHARACTER_KEYS = ['girl', 'boy']

export const TYPES_CNAME: {[key in IBasicData]: string} = {
  health: '健康',
  feeling: '心情',
  knowledge: '知识',
  relationship: '人际'
}
