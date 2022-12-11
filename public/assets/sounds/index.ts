import click from './click.mp3'
import bgmDark from './bgm-dark.mp3'
import bgmLight from './bgm-light.mp3'
import covidBgmLong from './covid-bgm-long.mp3'
import covidBgmShort from './covid-bgm-short.mp3'
import printing from './printing.mp3'
import next from './next.mp3'
import duration from './duration.mp3'
import coviding from './coviding.mp3'
import durationLight from './duration-light.mp3'
import ambulance from './ambulance.mp3'

export const KEYS = {
  CLICK: {
    KEY: 'click',
    SOURCE: click,
    DEFAULT_VOLUME: 0.6
  },
  BGM_DARK: {
    KEY: 'bgm-dark',
    SOURCE: bgmDark,
  },
  BGM_LIGHT: {
    KEY: 'bgm-light',
    SOURCE: bgmLight,
  },
  COVIDBGMLONG: {
    KEY: 'covid-bgm-long',
    SOURCE: covidBgmLong,
  },
  COVIDBGMSHORT: {
    KEY: 'covid-bgm-short',
    SOURCE: covidBgmShort,
  },
  PRINTING: {
    KEY: 'printing',
    SOURCE: printing,
  },
  NEXT: {
    KEY: 'next',
    SOURCE: next,
  },
  DURATION: {
    KEY: 'duration',
    SOURCE: duration,
  },
  COVIDING: {
    KEY: 'coviding',
    SOURCE: durationLight, // durationLight
  },
  YANG: {
    KEY: 'yang',
    SOURCE: ambulance, // ambulance
  },
}


export const assetHandler = {
  load: function(that){
    Object.keys(KEYS).forEach((sound) => {
      that.load.audio(`${KEYS[sound].KEY}-temp`, KEYS[sound].SOURCE)
    })
  },
  create: function(that) {
    Object.keys(KEYS).forEach((sound) => {
      that.cache.audio.add(
        `${KEYS[sound].KEY}`,
        that.sound.add(`${KEYS[sound].KEY}-temp`,
        {
          volume: KEYS[sound].KEY.DEFAULT_VOLUME
        }
      ))
      that.cache.audio.remove(`${KEYS[sound].KEY}-temp`)
    })
  },
  play: function(that: Phaser.Scene, key, config?: Phaser.Types.Sound.SoundConfig) {
    that.cache.audio.get(key).play(config)
  },
  stop: function(that, key) {
    that.cache.audio.get(key).stop()
  },
  isPlaying: function(that, key) {
    return that.cache.audio.get(key).isPlaying
  }
}
