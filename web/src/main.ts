import './styles.css'

import { Effect, Match as M, Schema as S } from 'effect'
import { Runtime } from 'foldkit'
import { pushUrl, load } from 'foldkit/navigation'
import { evo } from 'foldkit/struct'
import { Url, toString as urlToString } from 'foldkit/url'

import { main, Class, Html } from './html'
import { NoOp, LinkClicked, UrlChanged, Message } from './message'
import { AppRoute, urlToAppRoute } from './route'
import { navView } from './component/nav'
import { homeView } from './page/home'
import { RollModel, initialRollModel, updateRoll, rollView } from './page/roll'
import { notFoundView } from './page/notFound'

// MODEL

const Model = S.Struct({
  route: AppRoute,
  roll: RollModel,
})

type Model = typeof Model.Type

// INIT

const init: Runtime.ApplicationInit<Model, Message> = (url: Url) => [
  {
    route: urlToAppRoute(url),
    roll: initialRollModel,
  },
  [],
]

// UPDATE

const update = (
  model: Model,
  message: Message,
): [Model, ReadonlyArray<Runtime.Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<[Model, ReadonlyArray<Runtime.Command<Message>>]>(),
    M.tagsExhaustive({
      NoOp: () => [model, []],

      LinkClicked: ({ request }) =>
        M.value(request).pipe(
          M.tagsExhaustive({
            Internal: ({ url }): [Model, ReadonlyArray<Runtime.Command<Message>>] => [
              model,
              [pushUrl(urlToString(url)).pipe(Effect.as(NoOp.make()))],
            ],
            External: ({ href }): [Model, ReadonlyArray<Runtime.Command<Message>>] => [
              model,
              [load(href).pipe(Effect.as(NoOp.make()))],
            ],
          }),
        ),

      UrlChanged: ({ url }) => [
        evo(model, { route: () => urlToAppRoute(url) }),
        [],
      ],

      SelectDice: (msg) => {
        const [roll, cmds] = updateRoll(model.roll, msg)
        return [evo(model, { roll: () => roll }), cmds]
      },

      RollDice: (msg) => {
        const [roll, cmds] = updateRoll(model.roll, msg)
        return [evo(model, { roll: () => roll }), cmds]
      },

      DiceRolled: (msg) => {
        const [roll, cmds] = updateRoll(model.roll, msg)
        return [evo(model, { roll: () => roll }), cmds]
      },
    }),
  )

// VIEW

const view = (model: Model): Html => {
  const routeContent = M.value(model.route).pipe(
    M.tagsExhaustive({
      Home: homeView,
      Roll: () => rollView(model.roll),
      NotFound: ({ path }) => notFoundView(path),
    }),
  )

  return main([Class('page')], [
    navView(model.route),
    routeContent,
  ])
}

// RUN

const app = Runtime.makeApplication({
  Model,
  init,
  update,
  view,
  container: document.getElementById('root')!,
  browser: {
    onUrlRequest: (request) => LinkClicked.make({ request }),
    onUrlChange: (url) => UrlChanged.make({ url }),
  },
})

Runtime.run(app)
