import { Schema as S } from 'effect'

export const SceneModel = S.Struct({
  animating: S.Boolean,
})

export type SceneModel = typeof SceneModel.Type

export const initialSceneModel: SceneModel = {
  animating: true,
}
