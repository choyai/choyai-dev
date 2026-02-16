import { Effect, Exit, Scope } from 'effect'

import type { Html } from '../../html'
import { Class, OnClick, button, div, h1 } from '../../html'
import { ToggleAnimation } from './message'
import type { SceneModel } from './model'
import './styles.css'
import {
  type ThreeContext,
  acquireResizeObserver,
  acquireThreeContext,
  renderOnce,
  setAnimating,
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

const initScene = (canvas: HTMLCanvasElement, animating: boolean): void => {
  const program = Effect.gen(function* () {
    scope = yield* Scope.make()

    const threeCtx = yield* acquireThreeContext(canvas).pipe(
      Scope.extend(scope),
    )

    yield* acquireResizeObserver(threeCtx, canvas).pipe(Scope.extend(scope))

    renderOnce(threeCtx)
    setAnimating(threeCtx, animating)

    ctx = threeCtx
  })

  Effect.runSync(program)
}

const teardownScene = (): void => {
  if (scope) {
    Effect.runSync(Scope.close(scope, Exit.void))
    scope = null
    ctx = null
  }
}

const canvasVNode = (model: SceneModel): VNode => ({
  sel: 'canvas#three-canvas',
  data: {
    hook: {
      insert: (vnode: VNode) => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const canvas = vnode.elm as HTMLCanvasElement
        initScene(canvas, model.animating)
      },
      postpatch: () => {
        if (ctx) setAnimating(ctx, model.animating)
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

export const sceneView = (model: SceneModel): Html =>
  div(
    [Class('content scene-page')],
    [
      h1([Class('heading')], ['roll some dice']),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      Effect.succeed(containerVNode(model)) as Html,
      div(
        [Class('scene-controls')],
        [
          button(
            [
              Class(model.animating ? 'scene-btn active' : 'scene-btn'),
              OnClick(ToggleAnimation.make()),
            ],
            [model.animating ? 'Pause' : 'Play'],
          ),
        ],
      ),
    ],
  )
