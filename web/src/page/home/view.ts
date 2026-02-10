import type { Html } from '../../html'
import { Class, div, h1 } from '../../html'
import './styles.css'

export const homeView = (): Html =>
  div(
    [Class('content')],
    [h1([Class('heading')], ['hello, my name is chaiyo'])],
  )
