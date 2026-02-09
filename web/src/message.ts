import { Schema as S } from 'effect'
import { Runtime } from 'foldkit'
import { ts } from 'foldkit/schema'
import { Url } from 'foldkit/url'
import { RollMessage } from './page/roll/message'

// App-level messages

export const NoOp = ts('NoOp')
export const LinkClicked = ts('LinkClicked', { request: Runtime.UrlRequest })
export const UrlChanged = ts('UrlChanged', { url: Url })

export type NoOp = typeof NoOp.Type
export type LinkClicked = typeof LinkClicked.Type
export type UrlChanged = typeof UrlChanged.Type

// Combined message type

export const Message = S.Union(
  NoOp,
  LinkClicked,
  UrlChanged,
  RollMessage,
)

export type Message = typeof Message.Type
