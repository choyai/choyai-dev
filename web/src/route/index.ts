import { Schema as S, pipe } from 'effect'
import { Route } from 'foldkit'
import { literal } from 'foldkit/route'
import { ts } from 'foldkit/schema'

// Route Types

export const HomeRoute = ts('Home')
export const RollRoute = ts('Roll')
export const SceneRoute = ts('Scene')
export const NotFoundRoute = ts('NotFound', { path: S.String })

export const AppRoute = S.Union(HomeRoute, RollRoute, SceneRoute, NotFoundRoute)

export type HomeRoute = typeof HomeRoute.Type
export type RollRoute = typeof RollRoute.Type
export type SceneRoute = typeof SceneRoute.Type
export type NotFoundRoute = typeof NotFoundRoute.Type

export type AppRoute = typeof AppRoute.Type

// Routers

export const homeRouter = pipe(Route.root, Route.mapTo(HomeRoute))

export const rollRouter = pipe(literal('roll'), Route.mapTo(RollRoute))

export const sceneRouter = pipe(literal('scene'), Route.mapTo(SceneRoute))

const routeParser = Route.oneOf(sceneRouter, rollRouter, homeRouter)

export const urlToAppRoute = Route.parseUrlWithFallback(
  routeParser,
  NotFoundRoute,
)
