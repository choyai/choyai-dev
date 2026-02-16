import { Match as M } from 'effect'
import type { Runtime } from 'foldkit'
import { evo } from 'foldkit/struct'

import type { SceneMessage } from './message'
import type { DieSchema, SceneModel } from './model'

const randomOffset = (): { x: number; y: number; z: number } => ({
  x: (Math.random() - 0.5) * 4,
  y: (Math.random() - 0.5) * 4,
  z: (Math.random() - 0.5) * 2,
})

export const updateScene = (
  model: SceneModel,
  message: SceneMessage,
): [SceneModel, ReadonlyArray<Runtime.Command<SceneMessage>>] =>
  M.value(message).pipe(
    M.withReturnType<
      [SceneModel, ReadonlyArray<Runtime.Command<SceneMessage>>]
    >(),
    M.tagsExhaustive({
      ToggleAnimation: () => [evo(model, { animating: (a) => !a }), []],
      SpawnDie: () => {
        const id =
          model.dice.length === 0
            ? 0
            : Math.max(...model.dice.map((d) => d.id)) + 1
        const newDie: DieSchema = { id, ...randomOffset() }
        return [evo(model, { dice: (d) => [...d, newDie] }), []]
      },
      DespawnDie: ({ id }) => [
        evo(model, { dice: (d) => d.filter((die) => die.id !== id) }),
        [],
      ],
      ClearAllDice: () => [evo(model, { dice: () => [] }), []],
    }),
  )
