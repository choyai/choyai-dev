import { Schema as S } from 'effect'
import { ts } from 'foldkit/schema'

export const ToggleAnimation = ts('ToggleAnimation')
export const SpawnDie = ts('SpawnDie')
export const DespawnDie = ts('DespawnDie', { id: S.Number })
export const ClearAllDice = ts('ClearAllDice')

export const SceneMessage = S.Union(
  ToggleAnimation,
  SpawnDie,
  DespawnDie,
  ClearAllDice,
)

export type ToggleAnimation = typeof ToggleAnimation.Type
export type SpawnDie = typeof SpawnDie.Type
export type DespawnDie = typeof DespawnDie.Type
export type ClearAllDice = typeof ClearAllDice.Type

export type SceneMessage = typeof SceneMessage.Type
