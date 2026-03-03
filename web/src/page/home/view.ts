import type { Html } from '../../html'
import { Class, div, h1, p } from '../../html'
import './styles.css'

export const homeView = (): Html =>
  div(
    [Class('content')],
    [
      h1([Class('heading')], ["hey, I'm chaiyo"]),
      'a software engineer',
      p([], ['nothing much here for now, reach out to me via email below']),
      // p(
      //   [],
      //   [
      //     " or if you're cool, me on Reticulum: choyai lxma://5a28997d859eb0acf9ff3d7006eed64e:7aa981b06eac81772ea377dae9fe46f713807dae7a780f29ff95e94888746d7ea6df42d363712b479563be2394e1f033b4be6dfde2c6fd6e731c89274e67b57e ",
      //   ],
      // ),
    ],
  )
