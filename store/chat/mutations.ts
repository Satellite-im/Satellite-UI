import { ICurrentChat } from '~/types/chat/chat'
import { initialCurrentChat } from '~/store/chat/state'
import {
  ChatState,
  ChatReply,
  ChatText,
  ChatFileUpload,
} from '~/store/chat/types'

const mutations = {
  chatText(state: ChatState, req: ChatText) {
    state.chatTexts = state.chatTexts.some((item) => item.userId === req.userId)
      ? state.chatTexts.map((item) => {
          if (item.userId === req.userId) {
            return { ...item, value: req.value }
          }
          return item
        })
      : state.chatTexts.concat(req)
  },
  setChatReply(state: ChatState, req: ChatReply) {
    state.replies = state.replies.some((item) => item.replyId === req.replyId)
      ? state.replies.map((item) => {
          if (item.replyId === req.replyId) {
            return { ...item, value: req.value }
          }
          return item
        })
      : state.replies.concat(req)
  },
  addFile(
    state: ChatState,
    {
      file,
      address,
    }: {
      file: ChatFileUpload
      address: string
    },
  ) {
    state.files[address]
      ? state.files[address].push(file)
      : (state.files[address] = [file])
  },
  setFiles(
    state: ChatState,
    {
      files,
      address,
    }: {
      files: ChatFileUpload[]
      address: string
    },
  ) {
    state.files[address] = files
  },
  deleteFiles(state: ChatState, address: string) {
    delete state.files[address]
  },
  setCountError(state: ChatState, countError: boolean) {
    state.countError = countError
  },
  setCurrentChat(state: ChatState, currentChat: ICurrentChat) {
    state.currentChat = { ...state.currentChat, ...currentChat }
  },
  resetCurrentChat(state: ChatState) {
    state.currentChat = initialCurrentChat
  },
}

export default mutations
