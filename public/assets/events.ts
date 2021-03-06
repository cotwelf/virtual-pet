import { IBasicData } from "~/utils/types"

export interface IEventResItem {
  text: string
  dataChange?: {
    naze: string
    data?: {
      [key in IBasicData]?: number
    }
  }[]
}
export const eventDaily = {
  covid: {
    yin: [
      {
        text: '今天又是无事发生的一天。（甚至有种抗原兑着水也能阴的既视感',
      },
      {
        text: 'qwq 天啦噜，鼻子被自己捅出血可还行。。。',
        dataChange: [
          {
            naze: '鼻子出血痛痛',
            data: {
              feeling: -1
            }
          }
        ]
      },
      {
        text: '昨晚失眠，今儿个还要早起抗原，还让不让人活了啊 QAQ',
        dataChange: [
          {
            naze: '懒觉被迫中断',
            data: {
              feeling: -1
            }
          },
          {
            naze: '睡眠不足',
            data: {
              health: -1
            }
          }
        ]
      },
    ],
    yang: [
      {
        text: '啊这。。。。。。。。。。。。。。。。。',
        dataChange: [
          {
            naze: '确诊新冠',
            data: {
              feeling: -5,
              health: -5
            }
          }
        ]
      },
    ],
    again: [
      {
        text: 'eee 本次抗原失败了呢...原因大概是等待时间过短或过长，请再试一次吧~'
      }
    ]
  }
}
