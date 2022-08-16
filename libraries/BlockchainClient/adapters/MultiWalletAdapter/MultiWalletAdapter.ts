import {
  RpcResponseAndContext,
  SignatureResult,
  PublicKey,
} from '@solana/web3.js'

import {
  Account,
  Adapter,
  CreateUserParams,
  FriendAccount,
  FriendsEvents,
  FriendStatus,
  Group,
  User,
} from '../../interfaces'

import MultiWalletManager from '~/libraries/WalletManager/WalletManager'

export default class MultiWalletAdapter implements Adapter {
  private readonly $WalletManager: MultiWalletManager
  constructor() {
    this.$WalletManager = new MultiWalletManager()
  }

  initUserProgram(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  _getConnectionStatus(): boolean {
    return this.$WalletManager.WalletAdapter.connected
  }

  async signMessage(_message: string): Promise<Uint8Array> {
    return this.$WalletManager.signMessage(_message)
  }

  createRandomAccount(): Promise<Account | undefined> {
    throw new Error('Method not implemented.')
  }

  // here we don't need the mnemonic, since this function only triggers the wallet connection
  async getAccountFromMnemonic(_mnemonic: string): Promise<Account | null> {
    try {
      await this.$WalletManager.setWallet(_mnemonic)
      await this.$WalletManager.initWallet()

      const account: Account = {
        address: this.$WalletManager.getwalletPublicKey().toBase58(),
        publicKey: this.$WalletManager.getwalletPublicKey(),
      }
      window.console.log('account', account)
      return account
    } catch (error) {
      window.console.log('error', error)
      return null
    }
  }

  async getAccountBalance(_account: Account): Promise<number | null> {
    return await this.$WalletManager.getCurrentAccountBalance()
  }

  requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null> {
    throw new Error('This method dose not exist in Phantom')
  }

  async getActiveAccount(): Promise<Account | undefined> {
    if (this._getConnectionStatus()) {
      return {
        address: this.$WalletManager.getwalletPublicKey().toBase58(),
        publicKey: this.$WalletManager.getwalletPublicKey(),
      }
    }
    return undefined
  }

  async getPayerAccount(): Promise<Account | undefined> {
    return await this.getActiveAccount()
  }

  createUser(params: CreateUserParams): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getCurrentUserInfo(): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  getUserInfo(address: string): Promise<User | null> {
    throw new Error('Method not implemented.')
  }

  getUsersInfo(addresses: string[]): Promise<User[]> {
    throw new Error('Method not implemented.')
  }

  getFriendsByStatus(
    status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }> {
    throw new Error('Method not implemented.')
  }

  subscribeToEvents(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  addEventListener(
    type: FriendsEvents,
    callback: (data?: FriendAccount | undefined) => void,
  ): void {
    throw new Error('Method not implemented.')
  }

  computeAccountKeys(
    from: PublicKey,
    to: PublicKey,
  ): Promise<{ request: PublicKey; first: PublicKey; second: PublicKey }> {
    throw new Error('Method not implemented.')
  }

  getFriendsPayer(): Promise<Account> {
    throw new Error('Method not implemented.')
  }

  getAccountStatus(accountKey: PublicKey): Promise<FriendStatus> {
    throw new Error('Method not implemented.')
  }

  makeFriendRequest(
    request: PublicKey,
    first: PublicKey,
    second: PublicKey,
    k: String,
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  getFriendAccount(accountKey: PublicKey): Promise<FriendAccount | null> {
    throw new Error('Method not implemented.')
  }

  acceptFriendRequest(request: PublicKey, k: String): Promise<string> {
    throw new Error('Method not implemented.')
  }

  denyFriendRequest(request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeFriendRequest(request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeFriend(request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
  }

  closeFriendRequest(request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
  }

  createGroup(groupId: string, name: string): Promise<Group> {
    throw new Error('Method not implemented.')
  }

  getUserGroups(address: string | PublicKey): Promise<Group[]> {
    throw new Error('Method not implemented.')
  }

  getGroupsUsers(
    groupIds: string[],
  ): Promise<{ id: string; users: string[] }[]> {
    throw new Error('Method not implemented.')
  }

  inviteToGroup(groupId: string, recipient: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  addGroupInviteListener(cb: (group: Group) => void): Promise<string> {
    throw new Error('Method not implemented.')
  }

  unsubscribeGroupInviteListener(id: number): Promise<void> {
    throw new Error('Method not implemented.')
  }

  addGroupListener(id: string, cb: (value: Group) => void): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeGroupListeners(keys: string[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getGroupById(id: string): Promise<Group> {
    throw new Error('Method not implemented.')
  }

  getGroupUsers(groupId: string): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  addGroupsListener(cb: (value: Group) => void): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  setPhotoHash(photoHash: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
