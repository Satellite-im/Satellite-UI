import { FriendsState } from './types'
import { Friend, IncomingRequest, OutgoingRequest } from '~/types/ui/friends'
import { TextileState } from '../textile/types'

const mutations = {
  setIncomingRequests(
    state: FriendsState,
    incomingRequests: IncomingRequest[],
  ) {
    state.incomingRequests = incomingRequests
  },
  addIncomingRequest(state: FriendsState, incomingRequest: IncomingRequest) {
    state.incomingRequests.push(incomingRequest)
  },
  updateIncomingRequest(state: FriendsState, incomingRequest: IncomingRequest) {
    state.incomingRequests = state.incomingRequests.map((request) =>
      request.requestId !== incomingRequest.requestId
        ? request
        : incomingRequest,
    )
  },
  removeIncomingRequest(state: FriendsState, requestId: string) {
    state.incomingRequests = state.incomingRequests.filter(
      (request) => request.requestId !== requestId,
    )
  },
  setOutgoingRequests(
    state: FriendsState,
    outgoingRequests: OutgoingRequest[],
  ) {
    state.outgoingRequests = outgoingRequests
  },
  addOutgoingRequest(state: FriendsState, outgoingRequest: OutgoingRequest) {
    state.outgoingRequests.push(outgoingRequest)
  },
  updateOutgoingRequest(state: FriendsState, outgoingRequest: OutgoingRequest) {
    state.outgoingRequests = state.outgoingRequests.map((request) =>
      request.requestId !== outgoingRequest.requestId
        ? request
        : outgoingRequest,
    )
  },
  removeOutgoingRequest(state: FriendsState, requestId: string) {
    state.outgoingRequests = state.outgoingRequests.filter(
      (request) => request.requestId !== requestId,
    )
  },
  addFriend(state: FriendsState, friend: Friend) {
    state.all.push(friend)
  },
  setActive(state: FriendsState, friend: Friend) {
    const fList: Friend[] = []
    state.all.forEach((f) => {
      f.activeChat = f.account.accountId === friend.account.accountId
      fList.push(f)
    })
    state.all = fList
  },
  setTyping(
    state: FriendsState,
    opts: { id: string; typingState: 'TYPING' | 'NOT_TYPING' },
  ) {
    const fList: Friend[] = []
    state.all.forEach((f) => {
      fList.push({
        ...f,
        typingState:
          f.address === opts.id
            ? opts.typingState
            : f.typingState || 'NOT_TYPING',
      })
    })
    state.all = fList
  },
  updateFriend(state: FriendsState, friend: Friend) {
    state.all = state.all.map(
      (fr) => (fr = fr.address === friend.address ? friend : fr),
    )
  },
  removeFriend(state: FriendsState, friendTextilePublicKey: string) {
    state.all = state.all.filter(
      (fr) => fr.textilePubkey !== friendTextilePublicKey,
    )
  },
  sortFriends(state: FriendsState, textileObj: TextileState) {
    state.all = state.all
      .map((user) => {
        const converstaion = textileObj.conversations[user.address]
        user.lastUpdate = converstaion?.lastUpdate || 0
        return user
      })
      .sort((user1, user2) => user2.lastUpdate - user1.lastUpdate)
  },
}

export default mutations
