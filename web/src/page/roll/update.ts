import { Effect, Match as M, Option } from 'effect'
import { Runtime } from 'foldkit'
import { evo } from 'foldkit/struct'
import type { RollModel, DiceType } from './model'
import { DiceRolled, type RollMessage } from './message'

const diceMax = (dice: DiceType): number => {
  switch (dice) {
    case 'd4': return 4
    case 'd6': return 6
    case 'd8': return 8
    case 'd10': return 10
    case 'd12': return 12
    case 'd20': return 20
    case 'd100': return 100
  }
}

export const rollDiceEffect = (dice: DiceType): Runtime.Command<DiceRolled> =>
  Effect.sync(() => {
    const max = diceMax(dice)
    const result = Math.floor(Math.random() * max) + 1
    return DiceRolled.make({ result })
  })

export const updateRoll = (
  model: RollModel,
  message: RollMessage,
): [RollModel, ReadonlyArray<Runtime.Command<RollMessage>>] =>
  M.value(message).pipe(
    M.withReturnType<[RollModel, ReadonlyArray<Runtime.Command<RollMessage>>]>(),
    M.tagsExhaustive({
      SelectDice: ({ dice }) => [
        evo(model, {
          selectedDice: () => dice,
          rollResult: () => Option.none(),
        }),
        [],
      ],

      RollDice: () => [model, [rollDiceEffect(model.selectedDice)]],

      DiceRolled: ({ result }) => [
        evo(model, {
          rollResult: () => Option.some(result),
          rollHistory: (history) => [
            { dice: model.selectedDice, result },
            ...history.slice(0, 9),
          ],
        }),
        [],
      ],
    }),
  )
