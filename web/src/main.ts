import './footer.css'

import { Match as M, Schema } from 'effect'
import { Runtime } from 'foldkit'
import { Html, html } from 'foldkit/html'
import { ts } from 'foldkit/schema'

// MODEL

const Model = Schema.Number
type Model = typeof Model.Type

// MESSAGE

const Decrement = ts('Decrement')
const Increment = ts('Increment')
const Reset = ts('Reset')

const Message = Schema.Union(Decrement, Increment, Reset)

type Decrement = typeof Decrement.Type
type Increment = typeof Increment.Type
type Reset = typeof Reset.Type

export type Message = typeof Message.Type

// UPDATE

const update = (
  count: Model,
  message: Message,
): [Model, ReadonlyArray<Runtime.Command<Message>>] =>
  M.value(message).pipe(
    M.withReturnType<[Model, ReadonlyArray<Runtime.Command<Message>>]>(),
    M.tagsExhaustive({
      Decrement: () => [count - 1, []],
      Increment: () => [count + 1, []],
      Reset: () => [0, []],
    }),
  )

// INIT

const init: Runtime.ElementInit<Model, Message> = () => [0, []]

// VIEW

const { div, main, h1, button, footer, a, Class, OnClick, Href, Target } = html<Message>()

const view = (count: Model): Html =>
  main([Class('page')], [
	  h1([Class('heading')], ['hello, my name is chaiyo']),
    div([Class('row')], [
    ]),
    footer([Class('footer')], [
      a([Href('mailto:choyaichaiyo@gmail.com'), Class('link')], ['choyaichaiyo [at] gmail [dot] com']),
      a([Href('https://github.com/choyai'), Target('_blank'), Class('link')], ['github.com/choyai']),
    ]),
  ])

// RUN

const element = Runtime.makeElement({
  Model,
  init,
  update,
  view,
  container: document.getElementById('root')!,
})

Runtime.run(element)
