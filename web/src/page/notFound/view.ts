import { Class, Href, Html, a, div, h1, p } from '../../html'
import { homeRouter } from '../../route'

export const notFoundView = (path: string): Html =>
  div(
    [Class('content')],
    [
      h1([Class('heading')], ['404 - Not Found']),
      p([], [`The path "${path}" was not found.`]),
      a([Href(homeRouter.build({})), Class('link')], ['Go Home']),
    ],
  )
