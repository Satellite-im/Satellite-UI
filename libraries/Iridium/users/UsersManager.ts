import Vue from 'vue'
import { v4 } from 'uuid'
import {
  IridiumPeerIdentifier,
  Emitter,
  didUtils,
  encoding,
  IridiumPubsubMessage,
} from '@satellite-im/iridium'
import type {
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/src/types'
import { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import type { IridiumManager } from '../IridiumManager'
import { User, UsersError, UserStatus } from './types'
import logger from '~/plugins/local/logger'

export type IridiumUserEvent = {
  to?: IridiumPeerIdentifier
  name?: string
  status: UserStatus | 'changed' | 'removed'
  user: User
  data?: any
  at: number
}

export type UserState = { [key: User['did']]: User }

export type IridiumUserPubsub = IridiumPubsubMessage<
  IridiumDecodedPayload<IridiumUserEvent>
>

export default class UsersManager extends Emitter<IridiumUserPubsub> {
  public readonly iridium: IridiumManager
  public state: UserState = {}
  public ephemeral: { status: { [key: string]: UserStatus } } = { status: {} }

  private loggerTag = 'iridium/users'

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
  }

  get list() {
    return Object.values(this.state)
  }

  async init() {
    const iridium = this.iridium.connector
    if (!iridium) {
      throw new Error('cannot initialize users, no iridium connector')
    }

    logger.log(this.loggerTag, 'initializing')

    await this.fetch()
    this.ephemeral.status = Object.keys(this.state).reduce(
      (acc, did) => ({ ...acc, [did]: 'offline' }),
      {},
    )
    logger.log(this.loggerTag, 'users state loaded', this.state)

    logger.info(this.loggerTag, 'subscribing to announce topic')
    await iridium.subscribe<IridiumUserPubsub>('/users/announce', {
      handler: this.onUsersAnnounce.bind(this),
      sync: true,
    })
    logger.log(this.loggerTag, 'listening for user activity', this.state)

    this.iridium.connector?.p2p.on('peer/disconnect', (peer) => {
      logger.info(this.loggerTag, 'peer disconnected', peer)
      this.setUser(peer.did, {
        ...this.state[peer.did],
        seen: Date.now(),
      })
      this.setUserStatus(peer.did, 'offline')
    })

    await this.loadUserData()
    setInterval(async () => {
      await this.loadUserData()
    }, 10000)

    this.iridium.connector?.p2p.on(
      'node/message/sync/searchPeer',
      (message) => {
        const peers = message.payload.body.peers as User[]
        peers.forEach((peer) => {
          this.setUser(peer.did, peer)
        })
        this.emit(
          `searchResults${
            message.payload.body.request
              ? `/${message.payload.body.request}`
              : ''
          }`,
          peers,
        )
      },
    )

    logger.info(this.loggerTag, 'initialized', this)
    this.emit('ready', {})
  }

  async stop() {
    // announce that we're going offline
    await this.send({
      user: this.iridium.profile.getUser(),
      status: 'offline',
      at: Date.now(),
    })
  }

  async loadUserData() {
    this.list.forEach(async (user: User) => {
      if (
        this.ephemeral.status[user.did] === 'online' &&
        Number(user.seen) < Date.now() - 1000 * 30
      ) {
        logger.info(this.loggerTag, 'user timed out', user)
        this.iridium.users.setUser(user.did, {
          ...user,
          seen: Date.now(),
        })
        this.iridium.users.setUserStatus(user.did, 'offline')
      }
    })
  }

  async unsubscribe() {
    await this.iridium.connector?.unsubscribe(`/users/announce`)
  }

  /**
   * @method fetch
   * @description fetch remote state
   * @returns updated state
   */
  async fetch() {
    const fetched = await this.get('/')
    this.state = { ...fetched }
  }

  async getUsers(): Promise<{ [key: string]: User }> {
    return this.state || {}
  }

  private async onUsersAnnounce(message: IridiumUserPubsub) {
    const { from, payload } = message
    const { status, user } = payload.body
    logger.info(this.loggerTag, 'user announce', { from, status, user })

    if (status === 'removed') {
      return this.userRemove(from)
    }

    // update profile name
    const localUser = this.getUser(from) as User
    if (user && user.name) {
      logger.info(this.loggerTag, 'updating user details', {
        from,
        name: user.name,
        status: this.ephemeral.status[user.did],
      })
      this.ephemeral = {
        status: {
          ...this.ephemeral.status,
          [user.did]: (status || 'offline') as UserStatus,
        },
      }
      await this.setUser(from, {
        ...localUser,
        name: user.name || localUser.name,
      })
    }
  }

  /**
   * @method get
   * @description get remote state
   * @param path string (required)
   * @param options object
   * @returns iridium's connector result
   */
  get<T = any>(path: string, options: IridiumGetOptions = {}): Promise<T> {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }
    return this.iridium.connector?.get<T>(
      `/users${path === '/' ? '' : path}`,
      options,
    )
  }

  /**
   * @method set
   * @description updates remote state
   * @param path string (required)
   * @param payload any (required)
   * @param options object
   * @returns iridium's connector result
   */
  set(path: string, payload: any, options: IridiumSetOptions = {}) {
    logger.info(this.loggerTag, 'path, paylaod and state', {
      path,
      payload,
      state: this.state,
    })

    return this.iridium.connector?.set(
      `/users${path === '/' ? '' : path}`,
      payload,
      options,
    )
  }

  /**
   * @method hasUser
   * @description check on the local state if there's a user with the current id
   * @param id string (required)
   * @returns boolean
   */
  hasUser(did: IridiumPeerIdentifier) {
    const id = didUtils.didString(did)
    logger.info(this.loggerTag, 'has user', {
      id,
      hasUser: id && !!this.state[id],
    })
    return id && !!this.state?.[id]
  }

  /**
   * @method getUser
   * @description check if there's a user with the current id and returns user data object
   * @param id string (required)
   * @returns user data object if found in the local state
   */
  getUser(did: IridiumPeerIdentifier): User | undefined {
    return this.state[didUtils.didString(did)]
  }

  async searchPeer(query: string, page: number = 0): Promise<User[]> {
    const iridium = this.iridium.connector
    if (!iridium) {
      return []
    }

    return new Promise<User[]>((resolve) => {
      const id = v4()
      if (!iridium.p2p.primaryNodeID) {
        return resolve([])
      }

      const timeout = setTimeout(() => {
        logger.warn(this.loggerTag, 'peer search timeout', { query })
        resolve([])
      }, 10000)

      this.once(`searchResults/${id}`, (results: User[]) => {
        clearTimeout(timeout)
        logger.info(this.loggerTag, 'peer search results', results)
        resolve(results)
      })

      logger.info(this.loggerTag, 'peer search query', { query, page, id })
      return iridium.p2p.send(iridium.p2p.primaryNodeID, {
        type: 'sync/searchPeer',
        id,
        query,
        page,
      })
    })
  }

  async setUser(id: IridiumPeerIdentifier, user: User) {
    const did = didUtils.didString(id)
    this.state = { ...this.state, [did]: { ...this.state[did], ...user } }

    // rename chat conversations
    if (user.name) {
      const conversations = await this.iridium.chat.state.conversations
      Object.keys(conversations)
        .filter((key) => {
          const others = conversations[key].participants.filter(
            (p) => p !== this.iridium.connector?.id,
          )
          return others.length === 1 && others[0] === did
        })
        .forEach((conversationId) => {
          this.iridium.chat.state.conversations[conversationId].name = user.name
        })
    }

    logger.info(this.loggerTag, 'set user', { id, user })
    await this.set('/', this.state)
  }

  setUserStatus(did: IridiumPeerIdentifier, status: UserStatus) {
    // this.userStatus = { ...this.userStatus, [didUtils.didString(did)]: status }
    // Vue.set(this.userStatus, didUtils.didString(did), status)
    this.ephemeral = {
      status: {
        ...this.ephemeral.status,
        [didUtils.didString(did)]: status,
      },
    }
  }

  getUserStatus(did: IridiumPeerIdentifier) {
    return this.ephemeral.status[didUtils.didString(did)]
  }

  async send(event: IridiumUserEvent) {
    return this.iridium.connector?.publish(`/users/announce`, event, {
      encrypt: {
        recipients: event.to
          ? [typeof event.to === 'string' ? event.to : event.to.id]
          : this.iridium.friends.state.friends,
      },
    })
  }

  /**
   * @method userRemove
   * @description remove a user and announce it to the remote user
   * @param did - IridiumPeerIdentifier (required)
   * @returns Promise<void>
   */
  async userRemove(did: IridiumPeerIdentifier): Promise<void> {
    if (!this.iridium.connector) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }
    const profile = await this.iridium.profile?.get()
    if (!profile) {
      logger.error(this.loggerTag, 'network error')
      throw new Error(UsersError.NETWORK_ERROR)
    }

    const user = this.getUser(did)
    if (!user) {
      logger.error(this.loggerTag, 'user not found', { did })
      throw new Error(UsersError.USER_NOT_FOUND)
    }

    delete this.state[didUtils.didString(did)]
    this.state = { ...this.state }
    await this.set(`/`, this.state)
    const id = await encoding.hash(
      [user.did, this.iridium.connector?.id].sort(),
    )
    if (id && this.iridium.chat.hasConversation(id)) {
      this.iridium.chat.deleteConversation(id)
    }

    logger.info(this.loggerTag, 'user removed', { did, user })

    // Announce to the remote user
    if (didUtils.didString(did) !== this.iridium.connector?.id) {
      const payload: IridiumUserEvent = {
        to: did,
        status: 'removed',
        at: Date.now(),
        user: {
          name: profile.name,
          did: profile.did,
          status: profile.status || '',
        },
      }
      logger.info(this.loggerTag, 'announce remove user', {
        did,
        payload,
      })
      await this.send(payload)
    }
  }
}
