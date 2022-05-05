import {
  UIState,
  GlyphMarketViewStatus,
  Themes,
  Flairs,
  SettingsRoutes,
} from './types'
import { FileSortEnum } from '~/libraries/Enums/enums'

const InitialUIState = (): UIState => ({
  contextMenuStatus: false,
  showSidebarUsers: true,
  showSidebar: true,
  showSearchResult: false,
  showSettings: false,
  showMedia: false,
  settingsSideBar: true,
  settingsRoute: SettingsRoutes.PERSONALIZE,
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
    creategroup: false,
    walletMini: false,
    error: false,
    changelog: false,
    glyph: false,
    userProfile: false,
    groupInvite: { isOpen: false },
    callToAction: false,
    renameFile: false,
    crop: false,
    errorNetwork: false,
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
  showOlderMessagesInfo: false,
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
  mostEmojiUsed: [],
  recentGlyphs: [],
  theme: {
    base: Themes[0],
    flair: Flairs[0],
  },
  filesUploadStatus: '',
  renameItem: undefined,
  filePreview: undefined,
  fileDownloadList: [],
  chatImageOverlay: undefined,
  fileSort: {
    category: FileSortEnum.MODIFIED,
    asc: true,
  },
  swiperSlideIndex: 0,
})

export default InitialUIState
