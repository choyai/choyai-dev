import './styles.css'

import { a, div, footer, h1, Class, Href, Target, Html } from '../../html'

export const homeView = (): Html =>
  div([Class('content')], [
    h1([Class('heading')], ['hello, my name is chaiyo']),
    footer([Class('footer')], [
      a([Href('mailto:choyaichaiyo@gmail.com'), Class('link')], ['choyaichaiyo [at] gmail [dot] com']),
      a([Href('https://github.com/choyai'), Target('_blank'), Class('link')], ['github.com/choyai']),
    ]),
  ])
