import { Match as M } from 'effect'
import type { Runtime } from 'foldkit'
import { evo } from 'foldkit/struct'

import type { SceneMessage } from './message'
import type { SceneModel } from './model'

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
    }),
  )
