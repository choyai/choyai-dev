import { Effect, Match as M, Schema as S } from 'effect'
import { Runtime } from 'foldkit'
import { load, pushUrl } from 'foldkit/navigation'
import { evo } from 'foldkit/struct'
import type { Url } from 'foldkit/url'
import { toString as urlToString } from 'foldkit/url'

import { navView } from './component/nav'
import type { Html } from './html'
import { Class, Href, Target, a, div, footer, main } from './html'
import type { Message } from './message'
import { LinkClicked, NoOp, UrlChanged } from './message'
import { homeView } from './page/home'
import { notFoundView } from './page/notFound'
import { RollModel, initialRollModel, rollView, updateRoll } from './page/roll'
import { AppRoute, urlToAppRoute } from './route'
import './styles.css'

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
            Internal: ({
              url,
            }): [Model, ReadonlyArray<Runtime.Command<Message>>] => [
              model,
              [pushUrl(urlToString(url)).pipe(Effect.as(NoOp.make()))],
            ],
            External: ({
              href,
            }): [Model, ReadonlyArray<Runtime.Command<Message>>] => [
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

  return div(
    [Class('page')],
    [
      navView(model.route),
      main([], [routeContent]),
      footer(
        [Class('footer')],
        [
          a(
            [Href('mailto:choyaichaiyo@gmail.com'), Class('link')],
            ['choyaichaiyo [at] gmail [dot] com'],
          ),
          a(
            [
              Href('https://github.com/choyai'),
              Target('_blank'),
              Class('link'),
            ],
            ['github.com/choyai'],
          ),
        ],
      ),
    ],
  )
}

const getRoot = Effect.fromNullable(document.getElementById('root')).pipe(
  Effect.orDieWith(() => new Error('Missing #root element')),
)

const container = Effect.runSync(getRoot)
// RUN

const app = Runtime.makeApplication({
  Model,
  init,
  update,
  view,
  container,
  browser: {
    onUrlRequest: (request) => LinkClicked.make({ request }),
    onUrlChange: (url) => UrlChanged.make({ url }),
  },
})

Runtime.run(app)
