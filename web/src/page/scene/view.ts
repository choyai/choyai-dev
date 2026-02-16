import { Effect, Exit, Scope } from 'effect'

import { Class, OnClick, button, div, h1, span } from '../../html'
import type { Html } from '../../html'
import { ClearAllDice, DespawnDie, SpawnDie, ToggleAnimation } from './message'
import type { SceneModel } from './model'
import './styles.css'
import type { DieMesh } from './three-bridge'
import {
  type ThreeContext,
  acquireResizeObserver,
  acquireThreeContext,
  renderOnce,
  setAnimating,
  syncDice,
} from './three-bridge'

interface VNode {
  sel: string | undefined
  data: Record<string, unknown> | undefined
  children: Array<VNode | string> | undefined
  elm: Node | undefined
  text: string | undefined
  key: string | number | symbol | undefined
}

let scope: Scope.CloseableScope | null = null
let ctx: ThreeContext | null = null
let dice: Map<number, DieMesh> = new Map()

const initScene = (canvas: HTMLCanvasElement, model: SceneModel): void => {
  const program = Effect.gen(function* () {
    scope = yield* Scope.make()

    const threeCtx = yield* acquireThreeContext(canvas).pipe(
      Scope.extend(scope),
    )

    yield* acquireResizeObserver(threeCtx).pipe(Scope.extend(scope))

    dice = new Map()
    renderOnce(threeCtx)
    syncDice(threeCtx, dice, model.dice)
    setAnimating(threeCtx, model.animating)

    ctx = threeCtx
  })

  Effect.runSync(program)
}

const teardownScene = (): void => {
  if (scope) {
    Effect.runSync(Scope.close(scope, Exit.void))
    scope = null
    ctx = null
    dice = new Map()
  }
}

const canvasVNode = (model: SceneModel): VNode => ({
  sel: 'canvas#three-canvas',
  data: {
    hook: {
      insert: (vnode: VNode) => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const canvas = vnode.elm as HTMLCanvasElement
        initScene(canvas, model)
      },
      postpatch: () => {
        if (ctx) {
          syncDice(ctx, dice, model.dice)
          setAnimating(ctx, model.animating)
        }
      },
      destroy: () => {
        teardownScene()
      },
    },
  },
  children: undefined,
  elm: undefined,
  text: undefined,
  key: undefined,
})

const containerVNode = (model: SceneModel): VNode => ({
  sel: 'div.canvas-container',
  data: {},
  children: [canvasVNode(model)],
  elm: undefined,
  text: undefined,
  key: undefined,
})

export const sceneView = (model: SceneModel): Html => {
  const dieCount = model.dice.length

  const additionalBtns =
    dieCount > 0
      ? [
          button(
            [
              Class('scene-btn'),
              OnClick(DespawnDie.make({ id: model.dice[dieCount - 1].id })),
            ],
            ['Despawn Last'],
          ),
          button(
            [Class('scene-btn'), OnClick(ClearAllDice.make())],
            ['Clear All'],
          ),
        ]
      : []
  return div(
    [Class('content scene-page')],
    [
      h1([Class('heading')], ['roll some dice']),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      Effect.succeed(containerVNode(model)) as Html,
      span(
        [Class('dice-count')],
        [`(${dieCount} di${dieCount === 1 ? 'e' : 'ce'})`],
      ),
      div(
        [Class('scene-controls')],
        [
          button([Class('scene-btn'), OnClick(SpawnDie.make())], ['Spawn']),
          button(
            [
              Class(model.animating ? 'scene-btn active' : 'scene-btn'),
              OnClick(ToggleAnimation.make()),
            ],
            [model.animating ? 'Pause' : 'Play'],
          ),
          ...additionalBtns,
        ],
      ),
    ],
  )
}
