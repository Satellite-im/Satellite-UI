import { NuxtState } from '@nuxt/types/app'

export default {
  mute(state: NuxtState) {
    // We clone a new object here since vuex
    // will not react to deep values
    state.audio = {
      ...state.audio,
      muted: !state.audio.muted,
    }
  },
  deafen(state: NuxtState) {
    state.audio = {
      ...state.audio,
      deafened: !state.audio.deafened,
    }
  },
}
