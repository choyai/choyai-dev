import { Option, Schema as S } from 'effect'

export const DiceType = S.Literal('d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100')
export type DiceType = typeof DiceType.Type

export const RollModel = S.Struct({
  selectedDice: DiceType,
  rollResult: S.Option(S.Number),
  rollHistory: S.Array(S.Struct({ dice: DiceType, result: S.Number })),
})

export type RollModel = typeof RollModel.Type

export const initialRollModel: RollModel = {
  selectedDice: 'd20',
  rollResult: Option.none(),
  rollHistory: [],
}
