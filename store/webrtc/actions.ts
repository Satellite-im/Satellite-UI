import { PublicKey } from '@solana/web3.js'
import Vue from 'vue'
import { WebRTCError, WebRTCState } from './types'
import Crypto from '~/libraries/Crypto/Crypto'

import { ActionsArguments } from '~/types/store/store'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import Logger from '~/utilities/Logger'
import { TrackKind } from '~/libraries/WebRTC/types'
import { Config } from '~/config'
import { PropCommonEnum } from '~/libraries/Enums/enums'

const webRTCActions = {
  /**
   * @method initialized
   * @description Initializes the WebRTC Manager
   * @param originator Address of the current user
   * @example
   * this.$store.dispatch('webrtc/initialize')
   */
  async initialize(
    { commit }: ActionsArguments<WebRTCState>,
    originator: string,
  ) {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    const $Logger: Logger = Vue.prototype.$Logger

    $WebRTC.init(originator)
    $WebRTC.on('PEER_CONNECT', async ({ peerId }) => {
      $Logger.log('WebRTC', 'PEER_CONNECT', { peerId })
      const myPeers = await webRTCActions.getActivePeers()
      commit('setAllConnectedPeers', myPeers)
    })

    $WebRTC.on('ERROR', async () => {
      const myPeers = await webRTCActions.getActivePeers()
      commit('setAllConnectedPeers', myPeers)
    })

    commit('setInitialized', true)
  },
  /**
   * @method getActivePeers
   * @description returns an array of the user id's that have an open/active webtorrent signal
   * @example
   * this.$store.dispatch('webrtc/getActivePeers') // ['userid1', 'userid2']
   */
  async getActivePeers() {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    const peersArray: string[] = []
    if ($WebRTC.peers.size > 0) {
      $WebRTC.peers.forEach((e) => {
        if (Object.keys(e.communicationBus.instance.peers).length !== 0) {
          peersArray.push(e.identifier)
        }
      })
    }
    return peersArray
  },

  /**
   * @method createPeerConnection
   * @description Connects to a secret channel and waits the peer connection to happen
   * @param identifier Address of the current user
   * @example
   * this.$store.dispatch('webrtc/initialize')
   */
  async createPeerConnection(
    { commit, dispatch, state }: ActionsArguments<WebRTCState>,
    identifier: string,
  ) {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    const $Crypto: Crypto = Vue.prototype.$Crypto

    if (!$WebRTC.initialized) {
      throw new Error(WebRTCError.NOT_INITIALIZED)
    }

    const secretChannel = await $Crypto.computeSharedSecret(
      new PublicKey(identifier),
    )

    if (!secretChannel) {
      throw new Error('Unable to compute a secret channel')
    }

    $WebRTC.connect(identifier, secretChannel)

    const peer = $WebRTC.getPeer(identifier)

    let prevTimeout: ReturnType<typeof setTimeout>

    peer?.communicationBus.on('TYPING_STATE', ({ state, peerId }) => {
      commit(
        'friends/setTyping',
        { id: peerId, typingState: PropCommonEnum.TYPING },
        { root: true },
      )
      clearTimeout(prevTimeout)
      prevTimeout = setTimeout(() => {
        commit(
          'friends/setTyping',
          { id: peerId, typingState: PropCommonEnum.NOT_TYPING },
          { root: true },
        )
      }, Config.chat.typingInputThrottle * 3)
      dispatch('textile/subscribeToMailbox', {}, { root: true })
    })

    peer?.call.on('INCOMING_CALL', (data) => {
      // if incoming call is activer call return before toggling incoming call
      if (state.activeCall === data.peerId) {
        return
      }
      commit('setIncomingCall', data.peerId)
      commit('ui/showMedia', true, { root: true })
    })

    peer?.call.on('OUTGOING_CALL', (data) => {
      commit('setActiveCall', data.peerId)
      commit('ui/showMedia', true, { root: true })
    })

    peer?.call.on('CONNECTED', (data) => {
      commit('setIncomingCall', '')
      commit('setActiveCall', data.peerId)
      commit('updateCreatedAt', Date.now())
    })

    peer?.call.on('HANG_UP', (data) => {
      commit('setIncomingCall', '')
      commit('setActiveCall', '')
      commit('updateCreatedAt', 0)
      commit('updateLocalTracks', {
        audio: {},
        video: {},
      })

      commit('updateRemoteTracks', {
        audio: {},
        video: {},
      })
      commit('ui/showMedia', false, { root: true })
    })

    peer?.call.on('LOCAL_TRACK_CREATED', ({ track }) => {
      const update = { [track.kind]: { id: track.id, muted: !track.enabled } }

      commit('updateLocalTracks', update)

      if (track.kind === 'audio') {
        commit('audio/setMuted', !track.enabled, { root: true })
        commit('video/setDisabled', true, { root: true })
      }

      if (track.kind === 'video') {
        commit('video/setDisabled', !track.enabled, { root: true })
      }
    })

    peer?.call.on('LOCAL_TRACK_REMOVED', ({ track }) => {
      const update = { [track.kind]: { muted: true } }

      if (track.kind === 'audio') {
        commit('audio/setMuted', true, { root: true })
      }

      if (track.kind === 'video') {
        commit('video/setDisabled', true, { root: true })
      }

      commit('updateLocalTracks', update)
    })

    peer?.call.on('REMOTE_TRACK_RECEIVED', ({ track }) => {
      const update = { [track.kind]: { id: track.id, muted: !track.enabled } }

      commit('updateRemoteTracks', update)
    })

    peer?.call.on('REMOTE_TRACK_REMOVED', ({ track }) => {
      const update = { [track.kind]: { muted: true } }

      commit('updateRemoteTracks', update)
    })
  },
  denyCall({ commit }: ActionsArguments<WebRTCState>) {
    commit('setIncomingCall', '')
  },
  hangUp({ commit }: ActionsArguments<WebRTCState>) {
    commit('setActiveCall', '')
  },
  async call(
    { commit, state, dispatch, rootState }: ActionsArguments<WebRTCState>,
    kinds: TrackKind[],
  ) {
    if (!state.connectedPeers) return

    const $Hounddog = Vue.prototype.$Hounddog

    const activeFriend = $Hounddog.getActiveFriend(rootState.friends)

    if (!activeFriend) return

    const identifier = activeFriend.address

    if (!state.connectedPeers.includes(identifier)) {
      await dispatch('webrtc/createPeerConnection', identifier)
      if (!state.connectedPeers.includes(identifier)) return
    }

    // Trying to call the same user while call is already active
    if (identifier === state.activeCall) return

    const $WebRTC: WebRTC = Vue.prototype.$WebRTC

    const peer = $WebRTC.getPeer(identifier)

    try {
      await peer?.call.createLocalTracks(kinds)
      await peer?.call.start()
    } catch (error) {
      if (error instanceof Error) {
        // @ts-ignore
        this.app.$toast.error(this.app.i18n.t(error.message) as string)
      }
    }
  },
}

export default webRTCActions
