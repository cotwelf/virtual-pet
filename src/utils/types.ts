export type IBasicData = 'health' | 'feeling' | 'knowledge' | 'relationship'

export type IValueChangeType = 'decrease' | 'increase'

export interface IConmunicateConfig {
  dialogue: string,
  btns: {
    text: string,
    type: IBasicData,
    value: number,
  }[]
}
