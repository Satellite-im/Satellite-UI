import { IridiumDocument } from '~/../iridium/dist'
import Group from './Group'

export type GroupMemberDetails = {
  id: string
  name: string
  avatar: string
  seen: Date
}

export type GroupConfig = {
  name: string
  origin: string
  avatar?: string
  members: { [did: string]: GroupMemberDetails }
  metadata?: IridiumDocument
}

export type GroupData = GroupConfig & {
  id: string
}

export type GroupMap = { [key: string]: Group }

export enum GroupsError {
  GROUP_ALREADY_EXISTS = 'error.groups.group_already_exists',
  GROUP_NOT_FOUND = 'error.groups.group_not_found',
  GROUP_NOT_INITIALIZED = 'errors.groups.group_not_initialized',
  INVITE_ALREADY_SENT = 'errors.groups.request_already_sent',
  RECIPIENT_NOT_FOUND = 'errors.groups.recipient_not_found',
  USER_NOT_INITIALIZED = 'errors.groups.user_not_initialized',
}
