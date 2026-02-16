import type { Scope } from 'effect'
import { Effect } from 'effect'
import * as THREE from 'three'

export interface ThreeContext {
  readonly renderer: THREE.WebGLRenderer
  readonly scene: THREE.Scene
  readonly camera: THREE.PerspectiveCamera
  readonly mesh: THREE.Mesh
  animating: boolean
  animationId: number | null
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
  camera.position.z = 4

  const ambient = new THREE.AmbientLight(0x565f89, 0.6)
  scene.add(ambient)

  const directional = new THREE.DirectionalLight(0x7aa2f7, 1.2)
  directional.position.set(3, 4, 5)
  scene.add(directional)

  const point = new THREE.PointLight(0xbb9af7, 0.8, 20)
  point.position.set(-2, 2, 3)
  scene.add(point)

  const geometry = new THREE.IcosahedronGeometry()
  const material = new THREE.MeshStandardMaterial({
    color: 0x1a1b26,
    roughness: 0.8,
    metalness: 0.8,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.setRotationFromEuler(
    new THREE.Euler(
      110 * ((Math.PI * 2) / 360),
      (0 * (Math.PI * 2)) / 360,
      (0 * (Math.PI * 2)) / 360,
    ),
  )
  scene.add(mesh)

  const edges = new THREE.EdgesGeometry(geometry)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xbb9af7,
    linewidth: 1,
  })
  const wireframe = new THREE.LineSegments(edges, lineMaterial)
  mesh.add(wireframe)

  return { renderer, scene, camera, mesh, animating: false, animationId: null }
}

const disposeContext = (ctx: ThreeContext): void => {
  ctx.animating = false
  if (ctx.animationId !== null) {
    cancelAnimationFrame(ctx.animationId)
    ctx.animationId = null
  }
  ctx.mesh.geometry.dispose()
  if (ctx.mesh.material instanceof THREE.Material) {
    ctx.mesh.material.dispose()
  }
  ctx.mesh.children.forEach((child) => {
    if (child instanceof THREE.LineSegments) {
      child.geometry.dispose()
      if (child.material instanceof THREE.Material) {
        child.material.dispose()
      }
    }
  })
  ctx.renderer.dispose()
}

export const acquireThreeContext = (
  canvas: HTMLCanvasElement,
): Effect.Effect<ThreeContext, never, Scope.Scope> =>
  Effect.acquireRelease(
    Effect.sync(() => buildScene(canvas)),
    (ctx) => Effect.sync(() => disposeContext(ctx)),
  )

export const acquireResizeObserver = (
  ctx: ThreeContext,
  canvas: HTMLCanvasElement,
): Effect.Effect<ResizeObserver, never, Scope.Scope> =>
  Effect.acquireRelease(
    Effect.sync(() => {
      const observer = new ResizeObserver(() => {
        const width = canvas.clientWidth
        const height = canvas.clientHeight
        ctx.camera.aspect = width / height
        ctx.camera.updateProjectionMatrix()
        ctx.renderer.setSize(width, height)
        ctx.renderer.render(ctx.scene, ctx.camera)
      })
      observer.observe(canvas)
      return observer
    }),
    (observer) => Effect.sync(() => observer.disconnect()),
  )

export const setAnimating = (ctx: ThreeContext, value: boolean): void => {
  if (value && !ctx.animating) {
    ctx.animating = true
    ctx.renderer.render(ctx.scene, ctx.camera)
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
