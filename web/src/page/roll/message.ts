import { Schema as S } from 'effect'
import { ts } from 'foldkit/schema'
import { DiceType } from './model'

export const SelectDice = ts('SelectDice', { dice: DiceType })
export const RollDice = ts('RollDice')
export const DiceRolled = ts('DiceRolled', { result: S.Number })

export const RollMessage = S.Union(SelectDice, RollDice, DiceRolled)

export type SelectDice = typeof SelectDice.Type
export type RollDice = typeof RollDice.Type
export type DiceRolled = typeof DiceRolled.Type

export type RollMessage = typeof RollMessage.Type
