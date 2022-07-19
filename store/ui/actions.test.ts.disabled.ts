import Mousetrap from 'mousetrap'
import Vue from 'vue'
import TextileManager from '~/libraries/Textile/TextileManager'
import { RegistrationStatus } from '~/store/accounts/types'
import { DataStateType } from '~/store/dataState/types'
import { CaptureMouseTypes } from '~/store/settings/types'
import { TextileError } from '~/store/textile/types'
import * as actions from '~/store/ui/actions'
Vue.prototype.$TextileManager = new TextileManager()

const initialRootState: any = {
  accounts: {
    storePin: true,
    loading: true,
    locked: true,
    pin: '',
    pinHash: '',
    active: '',
    gasPrice: '',
    phrase: '',
    error: '',
    encryptedPhrase: '',
    registered: true,
    details: {
      name: '',
      address: '',
      status: '',
      state: 'idle',
      unreadCount: 123,
      profilePicture: '',
      badge: 'community',
      userAccount: '',
      mailboxId: '',
      textilePubkey: '',
    },
    registrationStatus: RegistrationStatus.IN_PROGRESS,
    lastVisited: '',
  },
  dataState: {
    files: DataStateType.Empty,
    friends: DataStateType.Loading,
    search: DataStateType.Ready,
  },
  friends: {
    incomingRequests: [
      {
        requestId: '',
        account: {
          accountId: '',
          from: '',
          status: 123,
          fromMailboxId: '',
          toMailboxId: '',
          to: '',
        },
        pending: true,
        from: '',
        userInfo: {
          name: '',
          servers: {},
          status: '',
          photoHash: '',
        },
      },
    ],
    outgoingRequests: [
      {
        to: '',
        requestId: '',
        account: {
          accountId: '',
          from: '',
          status: 123,
          fromMailboxId: '',
          toMailboxId: '',
          to: '',
        },
        pending: true,
      },
    ],
    all: [
      {
        publicKey: 'NoWiFi4you',
        typingState: 'NOT_TYPING',
        item: {},
        pending: true,
        activeChat: true,
        encryptedTextilePubkey: '',
        name: 'Taurus Nix',
        address: '0xdf9eb223bafbe5c5271415c75aecd68c21fe3d7f',
        account: {
          accountId: 'Checking Account',
          from: '.',
          status: 429,
          fromMailboxId: '12345',
          toMailboxId: 'v4.0.0-rc.4',
          to: './path/to/file',
        },
        textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
        status: '',
        state: 'idle',
        unreadCount: 123,
        profilePicture: '',
        badge: 'community',
        userAccount: '',
        mailboxId: '',
      },
    ],
  },
  textile: {
    initialized: true,
    conversations: {},
    conversationLoading: true,
    messageLoading: true,
    uploadProgress: {
      abc: {
        progress: 42,
        finished: false,
        name: 'file.pdf',
      },
    },
  },
  settings: {
    audioInput: '',
    audioOutput: '',
    videoInput: '',
    captureMouse: CaptureMouseTypes.always,
    noiseSuppression: true,
    echoCancellation: true,
    bitrate: 96000,
    sampleSize: 24,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userHasGivenAudioAccess: false,
    userDeniedAudioAccess: false,
    keybinds: {
      toggleMute: 'alt+m',
      toggleDeafen: 'alt+d',
      openSettings: 'alt+s',
      callActiveChat: 'alt+c',
    },
    embeddedLinks: true,
    displayCurrentActivity: true,
  },
}
const initialState = {
  contextMenuStatus: false,
  showSidebarUsers: true,
  showSidebar: true,
  showSearchResult: false,
  showSettings: false,
  settingsSideBar: true,
  settingsRoute: 'personalize',
  quickProfile: false,
  userProfile: {},
  contextMenuValues: [],
  contextMenuPosition: {
    x: 0,
    y: 0,
  },
  quickProfilePosition: {
    x: 0,
    y: 0,
  },
  modals: {
    changelog: false,
    createServer: false,
    error: false,
    glyph: false,
    marketplace: false,
    newfolder: false,
    quickchat: false,
    userProfile: false,
    wallet: false,
    walletMini: false,
  },
  glyphModalPack: '',
  chatbarContent: '',
  replyChatbarContent: {
    from: '',
    id: '',
    payload: '',
  },
  chatbarFocus: false,
  fullscreen: false,
  showPinned: false,
  enhancers: {
    containerWidth: 0,
    defaultHeight: '30rem',
    defaultWidth: '24rem',
    floating: false,
    position: [0, 0],
    route: 'emotes',
    show: false,
  },
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
  isTyping: {
    address: '0xc61b9bb3a7a0767e3179713f3a5c7a9aedce193c',
    last_message:
      'Ship of the imagination consciousness across the centuries network of wormholes finite but unbounded inconspicuous motes of rock and gas.',
    name: 'Phoenix Kalindi',
    profilePicture: '',
    state: 'online',
    status: 'Working on the space station',
    unreads: 4,
  },
  isReacted: false,
  activeChannel: undefined,
  settingReaction: {
    groupID: null,
    messageID: null,
    status: false,
  },
  hoveredGlyphInfo: undefined,
  glyphMarketplaceView: {
    shopId: null,
    view: 'home',
  },
  editMessage: {
    from: '',
    id: '',
    payload: '',
  },
  recentReactions: ['😰', '😡', '👍'],
  mostEmojiUsed: [],
  recentGlyphs: [],
  theme: {
    base: {
      class: '',
      name: 'default',
      text: 'Default',
      value: 'default',
    },
    flair: {
      text: 'Satellite',
      value: '#2761fd',
    },
  },
}

describe('init', () => {
  test('setMessages', () => {
    const commit = jest.fn()
    const messages = ['message 1']
    actions.default.setMessages({ commit }, messages)
    expect(commit).toHaveBeenCalledWith('setMessages', messages)
  })

  test('sendMessage', () => {
    const commit = jest.fn()
    const rootState: any = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'aktief',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        lastVisited: '',
      },
    }
    const message = {
      user: {
        address: 'aktief',
      },
    }

    actions.default.sendMessage({ commit, rootState }, message)
    expect(commit).toHaveBeenCalledWith('sendMessage', message)
  })

  test('sendMessage with non-matching addresses', () => {
    const commit = jest.fn()
    const rootState: any = {
      accounts: {
        storePin: true,
        loading: true,
        locked: true,
        pin: '',
        pinHash: '',
        active: 'aktief',
        gasPrice: '',
        phrase: '',
        error: '',
        encryptedPhrase: '',
        registered: true,
        details: {
          name: '',
          address: '',
          status: '',
          state: 'idle',
          unreadCount: 123,
          profilePicture: '',
          badge: 'community',
          userAccount: '',
          mailboxId: '',
          textilePubkey: '',
        },
        lastVisited: '',
      },
    }
    const message = {
      user: {
        address: 'not aktief',
      },
    }

    window.HTMLMediaElement.prototype.load = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.play = () => {
      return Promise.resolve()
    }
    window.HTMLMediaElement.prototype.pause = () => {
      return Promise.resolve()
    }

    actions.default.sendMessage({ commit, rootState }, message)
    expect(commit).toHaveBeenCalledWith('sendMessage', message)
  })

  test('setIsScrollOver', () => {
    const commit = jest.fn()
    actions.default.setIsScrollOver({ commit }, false)
    expect(commit).toHaveBeenCalledWith('setIsScrollOver', false)
  })

  test('setIsReacted', () => {
    const commit = jest.fn()
    actions.default.setIsReacted({ commit }, false)
    expect(commit).toHaveBeenCalledWith('setIsReacted', false)
  })

  test('setActiveChannel', () => {
    const commit = jest.fn()
    actions.default.setActiveChannel(
      { commit },
      {
        type: 'type',
        id: 'id',
        name: 'name',
      },
    )
    expect(commit).toHaveBeenCalledWith('setActiveChannel', {
      type: 'type',
      id: 'id',
      name: 'name',
    })
  })

  test('openSettings', () => {
    const commit = jest.fn()
    const state = { ...initialState }
    actions.default.openSettings({ commit, state })
    expect(commit).toHaveBeenCalledWith('toggleSettings', {
      show: !state.showSettings,
    })
  })

  test('setChatbarFocus', async () => {
    const dispatch = jest.fn()
    await actions.default.setChatbarFocus({ dispatch })
    expect(dispatch).toHaveBeenCalledWith('toggleChatbarFocus', false)
    expect(dispatch).toHaveBeenCalledWith('toggleChatbarFocus', true)
  })

  test('toggleChatbarFocus', async () => {
    const commit = jest.fn()
    const flag = true

    actions.default.toggleChatbarFocus({ commit }, flag)
    expect(commit).toHaveBeenCalledWith('setChatbarFocus', flag)
  })

  test('activateKeybinds', async () => {
    const dispatch = jest.fn()
    const rootState = { ...initialRootState }
    Mousetrap.reset = jest.fn()
    Mousetrap.bind = jest.fn()
    await actions.default.activateKeybinds({ dispatch, rootState })
    expect(Mousetrap.reset).toHaveBeenCalled()
    expect(Mousetrap.bind).toHaveBeenCalled()
    expect(Mousetrap.bind).toBeCalledTimes(4)
  })

  test('clearKeybinds', async () => {
    const dispatch = jest.fn()
    Mousetrap.reset = jest.fn()
    await actions.default.clearKeybinds({ dispatch })
    expect(Mousetrap.reset).toHaveBeenCalled()
  })

  test('setChatbarContent without userId', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const val = {
      content: 'content',
    }
    await actions.default.setChatbarContent({ commit, dispatch }, val)
    expect(commit).toHaveBeenCalledWith('chatbarContent', val.content)
  })

  test('setChatbarContent with userId', async () => {
    const commit = jest.fn()
    const dispatch = jest.fn()
    const val = {
      content: 'content',
      userId: '0x1',
    }
    await actions.default.setChatbarContent({ commit, dispatch }, val)
    expect(commit).toHaveBeenCalledWith('chatbarContent', val.content)
    expect(dispatch).toHaveBeenCalledWith(
      'chat/setChatText',
      { value: val.content, userId: val.userId },
      { root: true },
    )
  })

  test('showQuickProfile with payload', async () => {
    const commit = jest.fn()
    const rootState = { ...initialRootState }
    const localInitState = { ...initialState }
    const payload = {
      textilePublicKey: 'public key',
      position: {
        x: 6,
        y: 2,
      },
    }
    await actions.default.showQuickProfile(
      { commit, localInitState, rootState },
      payload,
    )
    expect(commit).toHaveBeenCalledWith(
      'setQuickProfilePosition',
      payload.position,
    )
  })

  test('showQuickProfile without payload', async () => {
    const commit = jest.fn()
    const localInitState = { ...initialState }
    const rootState = { ...initialRootState }
    const payload = {}
    const result = await actions.default.showQuickProfile(
      { commit, localInitState, rootState },
      payload,
    )
    expect(commit).not.toHaveBeenCalledWith(
      'setQuickProfilePosition',
      payload.position,
    )
    expect(result).toBeUndefined()
  })

  test('showProfile with existing friend metadata', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.metadataManager = jest.fn()
    TMConstructor.metadataManager.getFriendMetadata = jest
      .fn()
      .mockReturnValueOnce({
        note: 'friend metadata',
      })

    const commit = jest.fn()
    const rootState = { ...initialRootState }
    const dispatch = jest.fn()

    await actions.default.showProfile(
      { commit, rootState, dispatch },
      rootState.friends,
    )
    expect(commit).toHaveBeenCalledWith('toggleModal', {
      name: 'userProfile',
      state: true,
    })
  })

  test('showProfile with no friend metadata', async () => {
    const TMConstructor = Vue.prototype.$TextileManager

    const commit = jest.fn()
    const rootState = { ...initialRootState }
    const dispatch = jest.fn()

    await actions.default.showProfile(
      { commit, rootState, dispatch },
      rootState.friends,
    )
    expect(commit).toHaveBeenCalledWith('toggleModal', {
      name: 'userProfile',
      state: true,
    })
  })

  test('showProfile with no passed-in user argument', async () => {
    const TMConstructor = Vue.prototype.$TextileManager

    const commit = jest.fn()
    const rootState = { ...initialRootState }
    const dispatch = jest.fn()

    const result = await actions.default.showProfile(
      { commit, rootState, dispatch },
      null,
    )
    expect(result).toBeUndefined()
  })

  test('showProfile with no passed-in user metadata argument', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.metadataManager = jest.fn()
    TMConstructor.metadataManager.getFriendMetadata = jest
      .fn()
      .mockReturnValueOnce({
        note: 'friend metadata',
      })

    const commit = jest.fn()
    const rootState = { ...initialRootState }
    const dispatch = jest.fn()
    const argument = rootState.friends.all

    argument.metadata = {
      publicKey: 'NoWiFi4you',
      typingState: 'NOT_TYPING',
      item: {},
      pending: true,
      encryptedTextilePubkey: '',
      name: 'Taurus Nix',
      address: 'QmckZzdVd72h9QUFuJJpQqhsZqGLwjhh81qSvZ9BhB2FQi', // ADDRESS FOR PEER ID
      account: {
        accountId: 'Checking Account',
        from: '.',
        status: 429,
        fromMailboxId: '12345',
        toMailboxId: 'v4.0.0-rc.4',
        to: './path/to/file',
      },
      textilePubkey: 'https://accounts.google.com/o/oauth2/revoke?token=%s',
      status: '',
      state: 'idle',
      unreadCount: 123,
      profilePicture: '',
      badge: 'community',
      userAccount: '',
      mailboxId: '',
      metadata: {
        // Notice this existing metadata
        note: 'metadata',
      },
    }

    const result = await actions.default.showProfile(
      { commit, rootState, dispatch },
      argument,
    )
    expect(
      TMConstructor.metadataManager.getFriendMetadata,
    ).not.toHaveBeenCalled() // Because it has metadata, the function should note be called
    expect(result).toBeUndefined()
  })

  test('sendNotification with initialized mailbox manager', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.notificationManager = jest.fn()
    TMConstructor.notificationManager.sendNotification = jest
      .fn()
      .mockReturnValueOnce({
        note: 'notification response',
      })
    TMConstructor.notificationManager.isInitialized = jest
      .fn()
      .mockReturnValueOnce(true)

    const commit = jest.fn()
    const rootState = { ...initialRootState }
    rootState.textile.activeConversation = 'not_fromAddress'

    await actions.default.sendNotification(
      { commit, rootState },
      {
        message: 'message',
        from: 'from',
        fromAddress: 'fromAddress',
        imageHash: 'imageHash',
        title: 'title',
        type: 'DEV',
      },
    )
    expect(commit).toHaveBeenCalledWith('sendNotification', {
      note: 'notification response',
    })
  })

  test('sendNotification without an initialized mailbox manager', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.notificationManager = jest.fn()
    TMConstructor.notificationManager.isInitialized = jest
      .fn()
      .mockReturnValueOnce(false)

    const commit = jest.fn()
    const rootState = { ...initialRootState }

    try {
      await actions.default.sendNotification(
        { commit, rootState },
        {
          message: 'message',
          from: 'from',
          imageHash: 'imageHash',
          title: 'title',
          type: 'DEV',
        },
      )
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        TextileError.MAILBOX_MANAGER_NOT_INITIALIZED,
      )
    }
  })

  test('sendNotification with initialized mailbox manager', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.notificationManager = jest.fn()
    TMConstructor.notificationManager.getnotifications = jest
      .fn()
      .mockReturnValueOnce({
        note: 'notification response',
      })
    TMConstructor.notificationManager.isInitialized = jest
      .fn()
      .mockReturnValueOnce(true)

    const commit = jest.fn()

    await actions.default.setNotifications({ commit })
    expect(commit).toHaveBeenCalledWith('setNotifications', {
      note: 'notification response',
    })
  })

  test('setNotifications without an initialized mailbox manager', async () => {
    const TMConstructor = Vue.prototype.$TextileManager
    TMConstructor.notificationManager = jest.fn()
    TMConstructor.notificationManager.isInitialized = jest
      .fn()
      .mockReturnValueOnce(false)

    const commit = jest.fn()

    try {
      await actions.default.setNotifications({ commit })
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty(
        'message',
        TextileError.MAILBOX_MANAGER_NOT_INITIALIZED,
      )
    }
  })
})