export type IBasicDataType = 'health' | 'feeling' | 'knowledge' | 'relationship'

export type IValueChangeType = 'decrease' | 'increase'

export interface IConmunicateConfig {
  dialogue: string,
  btns: {
    text: string,
    type: IBasicDataType,
    value: number,
  }[]
}