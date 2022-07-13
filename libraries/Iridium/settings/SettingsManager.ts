import { Emitter } from '@satellite-im/iridium'
import { IridiumManager } from '../IridiumManager'
import { setInObject } from '../utils'
import {
  ThemeKeys,
  FlairKeys,
  LanguageKeys,
  Settings,
  defaultKeybinds,
  defaultSounds,
} from './types'
import merge from 'deepmerge'
import { overwriteMerge } from '~/utilities/merge'

const initialState: Settings = {
  theme: ThemeKeys.DEFAULT,
  flair: FlairKeys.SATELLITE,
  language: LanguageKeys.EN_US,
  video: {
    flipLocalStream: true,
  },
  audio: {
    sounds: defaultSounds,
  },
  keybinds: defaultKeybinds,
  privacy: {
    embeddedLinks: true,
    displayCurrentActivity: true,
    consentToScan: false,
    blockNsfw: true,
  },
}

export default class SettingsManager extends Emitter {
  public readonly iridium: IridiumManager
  public state: Settings

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
    this.state = initialState
  }

  async init() {
    await this.fetch()
  }

  private async fetch() {
    this.state = merge(initialState, await this.get(), {
      arrayMerge: overwriteMerge,
    })
  }

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/settings${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    setInObject(this.state, path, payload)
    return this.iridium.connector?.set(`/settings${path}`, payload, options)
  }
}
