import { Option } from 'effect'

import type { Html } from '../../html'
import {
  Class,
  OnClick,
  button,
  div,
  h1,
  h2,
  li,
  p,
  span,
  ul,
} from '../../html'
import { RollDice, SelectDice } from './message'
import type { DiceType, RollModel } from './model'
import './styles.css'

const diceTypes: ReadonlyArray<DiceType> = [
  'd4',
  'd6',
  'd8',
  'd10',
  'd12',
  'd20',
  'd100',
]

export const rollView = (model: RollModel): Html =>
  div(
    [Class('content')],
    [
      h1([Class('heading')], ['Dice Roller']),
      div(
        [Class('dice-selector')],
        [
          p([Class('label')], ['Select dice:']),
          div(
            [Class('dice-buttons')],
            diceTypes.map((dice) =>
              button(
                [
                  Class(
                    model.selectedDice === dice
                      ? 'dice-btn selected'
                      : 'dice-btn',
                  ),
                  OnClick(SelectDice.make({ dice })),
                ],
                [dice.toUpperCase()],
              ),
            ),
          ),
        ],
      ),
      div(
        [Class('roll-section')],
        [
          button(
            [Class('roll-btn'), OnClick(RollDice.make())],
            [`Roll ${model.selectedDice.toUpperCase()}`],
          ),
          Option.match(model.rollResult, {
            onNone: () => div([Class('result')], []),
            onSome: (result) =>
              div(
                [Class('result')],
                [span([Class('result-value')], [String(result)])],
              ),
          }),
        ],
      ),
      model.rollHistory.length > 0
        ? div(
            [Class('history')],
            [
              h2([Class('history-title')], ['Roll History']),
              ul(
                [Class('history-list')],
                model.rollHistory.map((roll) =>
                  li(
                    [Class('history-item')],
                    [
                      span([Class('history-dice')], [roll.dice.toUpperCase()]),
                      span([Class('history-result')], [String(roll.result)]),
                    ],
                  ),
                ),
              ),
            ],
          )
        : div([], []),
    ],
  )
