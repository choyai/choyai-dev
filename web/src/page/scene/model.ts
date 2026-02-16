import { Schema as S } from 'effect'

export const DieSchema = S.Struct({
  id: S.Number,
  x: S.Number,
  y: S.Number,
  z: S.Number,
})

export const SceneModel = S.Struct({
  animating: S.Boolean,
  dice: S.Array(DieSchema),
})

export type DieSchema = typeof DieSchema.Type
export type SceneModel = typeof SceneModel.Type

export const initialSceneModel: SceneModel = {
  animating: true,
  dice: [],
}
