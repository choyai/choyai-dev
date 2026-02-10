import type { Html } from '../html'
import { Class, Href, a, li, nav, ul } from '../html'
import { type AppRoute, homeRouter, rollRouter } from '../route'
import './nav.css'

export const navView = (currentRoute: AppRoute): Html =>
  nav(
    [Class('nav')],
    [
      ul(
        [Class('nav-list')],
        [
          li(
            [],
            [
              a(
                [
                  Href(homeRouter.build({})),
                  Class(
                    currentRoute._tag === 'Home'
                      ? 'nav-link active'
                      : 'nav-link',
                  ),
                ],
                ['home'],
              ),
            ],
          ),
          li(
            [],
            [
              a(
                [
                  Href(rollRouter.build({})),
                  Class(
                    currentRoute._tag === 'Roll'
                      ? 'nav-link active'
                      : 'nav-link',
                  ),
                ],
                ['roll'],
              ),
            ],
          ),
        ],
      ),
    ],
  )
