import './styles.css'

import { div, h1, Class, Html } from '../../html'

export const homeView = (): Html =>
  div([Class('content')], [
    h1([Class('heading')], ['hello, my name is chaiyo']),
  ])
