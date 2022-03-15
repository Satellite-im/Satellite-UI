import { UIState, GlyphMarketViewStatus, Themes, Flairs } from './types'

const InitialUIState = (): UIState => ({
  contextMenuStatus: false,
  showSidebarUsers: true,
  showSidebar: true,
  showSearchResult: false,
  showSettings: false,
  showMedia: false,
  settingsSideBar: true,
  settingsRoute: 'personalize',
  quickProfile: false,
  userProfile: {},
  contextMenuValues: [],
  contextMenuPosition: { x: 0, y: 0 },
  quickProfilePosition: { x: 0, y: 0 },
  modals: {
    newfolder: false,
    createServer: false,
    marketplace: false,
    wallet: false,
    quickchat: false,
    walletMini: false,
    error: false,
    changelog: false,
    glyph: false,
    userProfile: false,
  },
  glyphModalPack: '',
  chatbarContent: '',
  replyChatbarContent: { id: '', from: '', payload: '' },
  chatbarFocus: false,
  fullscreen: false,
  showPinned: false,
  enhancers: {
    show: false,
    floating: false,
    position: [0, 0],
    defaultWidth: '24rem',
    defaultHeight: '30rem',
    containerWidth: 0,
    route: 'emotes',
  },
  messages: [],
  unreadMessage: 0,
  isScrollOver: false,
  isTyping: false,
  isReacted: false,
  activeChannel: undefined,
  settingReaction: { status: false, groupID: null, messageID: null },
  hoveredGlyphInfo: undefined,
  glyphMarketplaceView: {
    view: GlyphMarketViewStatus.HOME,
    shopId: null,
  },
  editMessage: { id: '', from: '', payload: '' },
  recentReactions: ['👍', '😂', '♥️'],
  mostEmojiUsed: [],
  recentGlyphs: [],
  theme: {
    base: Themes[0],
    flair: Flairs[0],
  },
  isLoadingFileIndex: false,
  swiperSlideIndex: 0,
  showMobileAddFriend: false, // flag to swipe slide 2 which is add friend slide
})

export default InitialUIState
