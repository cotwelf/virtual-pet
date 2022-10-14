import click from '../../public/assets/sounds/click.mp3'
import bgmDark from '../../public/assets/sounds/bgm-dark.mp3'
import bgmLight from '../../public/assets/sounds/bgm-light.mp3'
import covidBgmLong from '../../public/assets/sounds/covid-bgm-long.mp3'
import covidBgmShort from '../../public/assets/sounds/covid-bgm-short.mp3'
import printing from '../../public/assets/sounds/printing.mp3'
import next from '../../public/assets/sounds/next.mp3'
import duration from '../../public/assets/sounds/duration.mp3'
import coviding from '../../public/assets/sounds/coviding.mp3'
import durationLight from '../../public/assets/sounds/duration-light.mp3'
import ambulance from '../../public/assets/sounds/ambulance.mp3'

export const ASSET_KEYS = {
  AUDIO: {
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
}

export const handleAssets = {
  load: function(that){
    Object.keys(ASSET_KEYS.AUDIO).forEach((sound) => {
      that.load.audio(`${ASSET_KEYS.AUDIO[sound].KEY}-temp`, ASSET_KEYS.AUDIO[sound].SOURCE)
    })
  },
  create: function(that) {
    Object.keys(ASSET_KEYS.AUDIO).forEach((sound) => {
      that.cache.audio.add(
        `${ASSET_KEYS.AUDIO[sound].KEY}`,
        that.sound.add(`${ASSET_KEYS.AUDIO[sound].KEY}-temp`,
        {
          volume: ASSET_KEYS.AUDIO[sound].KEY.DEFAULT_VOLUME
        }
      ))
      that.cache.audio.remove(`${ASSET_KEYS.AUDIO[sound].KEY}-temp`)
    })
  },
  play: function(that: Phaser.Scene, key, config?: Phaser.Types.Sound.SoundConfig) {
    that.cache.audio.get(key).play(config)
  },
  stop: function(that, key) {
    that.cache.audio.get(key).stop()
  }
}
