import { Schema as S } from 'effect'
import { ts } from 'foldkit/schema'

export const ToggleAnimation = ts('ToggleAnimation')

export const SceneMessage = S.Union(ToggleAnimation)

export type ToggleAnimation = typeof ToggleAnimation.Type

export type SceneMessage = typeof SceneMessage.Type
