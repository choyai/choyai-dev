import './nav.css'

import { a, li, nav, ul, Class, Href, Html } from '../html'
import { type AppRoute, homeRouter, rollRouter } from '../route'

export const navView = (currentRoute: AppRoute): Html =>
  nav([Class('nav')], [
    ul([Class('nav-list')], [
      li([], [
        a(
          [Href(homeRouter.build({})), Class(currentRoute._tag === 'Home' ? 'nav-link active' : 'nav-link')],
          ['home'],
        ),
      ]),
      li([], [
        a(
          [Href(rollRouter.build({})), Class(currentRoute._tag === 'Roll' ? 'nav-link active' : 'nav-link')],
          ['roll'],
        ),
      ]),
    ]),
  ])
