import type { Scope } from 'effect'
import { Effect } from 'effect'
import * as THREE from 'three'

export interface DieMesh {
  readonly id: number
  readonly mesh: THREE.Mesh
  readonly edges: THREE.LineSegments
}

export interface ThreeContext {
  readonly renderer: THREE.WebGLRenderer
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera
  animating: boolean
  animationId: number | null
}

let nextDieId = 0

const createDieMesh = (x: number, y: number, z: number): DieMesh => {
  const id = nextDieId++
  const geometry = new THREE.IcosahedronGeometry()
  const material = new THREE.MeshStandardMaterial({
    color: 0x1a1b26,
    roughness: 0.8,
    metalness: 0.8,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  mesh.setRotationFromEuler(
    new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      0,
    ),
  )

  const edges = new THREE.EdgesGeometry(geometry)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xbb9af7,
    linewidth: 1,
  })
  const wireframe = new THREE.LineSegments(edges, lineMaterial)
  mesh.add(wireframe)

  return { id, mesh, edges: wireframe }
}

const buildScene = (canvas: HTMLCanvasElement): ThreeContext => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x1a1b26)

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000,
  )
  camera.position.z = 6

  const ambient = new THREE.AmbientLight(0x565f89, 0.6)
  scene.add(ambient)

  const directional = new THREE.DirectionalLight(0x7aa2f7, 1.2)
  directional.position.set(3, 4, 5)
  scene.add(directional)

  const point = new THREE.PointLight(0xbb9af7, 0.8, 20)
  point.position.set(-2, 2, 3)
  scene.add(point)

  return { renderer, scene, camera, animating: false, animationId: null }
}

const disposeDie = (dieMesh: DieMesh): void => {
  dieMesh.mesh.geometry.dispose()
  if (dieMesh.mesh.material instanceof THREE.Material) {
    dieMesh.mesh.material.dispose()
  }
  dieMesh.edges.geometry.dispose()
  if (dieMesh.edges.material instanceof THREE.Material) {
    dieMesh.edges.material.dispose()
  }
  dieMesh.mesh.remove(dieMesh.edges)
}

const disposeContext = (
  dice: Map<number, DieMesh>,
  ctx: ThreeContext,
): void => {
  ctx.animating = false
  if (ctx.animationId !== null) {
    cancelAnimationFrame(ctx.animationId)
    ctx.animationId = null
  }
  dice.forEach((dieMesh) => {
    if (dieMesh.mesh.parent) {
      ctx.scene.remove(dieMesh.mesh)
    }
    disposeDie(dieMesh)
  })
  dice.clear()
  ctx.renderer.dispose()
}

export const acquireThreeContext = (
  canvas: HTMLCanvasElement,
): Effect.Effect<ThreeContext, never, Scope.Scope> =>
  Effect.acquireRelease(
    Effect.sync(() => buildScene(canvas)),
    (ctx) => Effect.sync(() => disposeContext(new Map(), ctx)),
  )

export const acquireResizeObserver = (
  ctx: ThreeContext,
): Effect.Effect<ResizeObserver, never, Scope.Scope> =>
  Effect.acquireRelease(
    Effect.sync(() => {
      const observer = new ResizeObserver(() => {
        ctx.renderer.render(ctx.scene, ctx.camera)
      })
      return observer
    }),
    (observer) => Effect.sync(() => observer.disconnect()),
  )

export const spawnDie = (
  ctx: ThreeContext,
  dice: Map<number, DieMesh>,
  modelDice: readonly { id: number; x: number; y: number; z: number }[],
): void => {
  modelDice.forEach((die) => {
    const existing = dice.get(die.id)
    if (existing) return
    const dieMesh = createDieMesh(die.x, die.y, die.z)
    ctx.scene.add(dieMesh.mesh)
    dice.set(die.id, dieMesh)
  })
}

export const despawnDie = (
  ctx: ThreeContext,
  dice: Map<number, DieMesh>,
  id: number,
): void => {
  const dieMesh = dice.get(id)
  if (dieMesh) {
    ctx.scene.remove(dieMesh.mesh)
    disposeDie(dieMesh)
    dice.delete(id)
  }
}

export const syncDice = (
  ctx: ThreeContext,
  dice: Map<number, DieMesh>,
  modelDice: readonly { id: number; x: number; y: number; z: number }[],
): void => {
  const modelIds = new Set(modelDice.map((d) => d.id))

  dice.forEach((dieMesh, id) => {
    if (!modelIds.has(id)) {
      ctx.scene.remove(dieMesh.mesh)
      disposeDie(dieMesh)
      dice.delete(id)
    }
  })

  modelDice.forEach((die) => {
    const existing = dice.get(die.id)
    if (existing) {
      existing.mesh.position.set(die.x, die.y, die.z)
    } else {
      const dieMesh = createDieMesh(die.x, die.y, die.z)
      ctx.scene.add(dieMesh.mesh)
      dice.set(die.id, dieMesh)
    }
  })
}

export const setAnimating = (ctx: ThreeContext, value: boolean): void => {
  if (value && !ctx.animating) {
    ctx.animating = true
    ctx.animationId = requestAnimationFrame(() => animate(ctx))
  } else if (!value && ctx.animating) {
    ctx.animating = false
    if (ctx.animationId !== null) {
      cancelAnimationFrame(ctx.animationId)
      ctx.animationId = null
    }
  }
}

export const renderOnce = (ctx: ThreeContext): void => {
  ctx.renderer.render(ctx.scene, ctx.camera)
}

const animate = (ctx: ThreeContext): void => {
  if (!ctx.animating) return
  ctx.renderer.render(ctx.scene, ctx.camera)
  ctx.animationId = requestAnimationFrame(() => animate(ctx))
}
