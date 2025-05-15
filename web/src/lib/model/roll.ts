type AST = Dice | Add | Subtract | Constant

type Dice = {
  tag: "Dice"
  count: number
  sides: number
}
type Add = {
  tag: "Add"
  left: AST
  right: AST
}
type Subtract = {
  tag: "Subtract"
  left: AST
  right: AST
}
type Constant = {
  tag: "Constant"
  value: number
}

// parseDice -> maybe dice // use Effect maybe
const parseDice = (input: string): Dice | undefined => {
}

const tokenize = (input: string): string[] =>
  input.match(/\s*(\d+d\d+|\d+|[()+-])\s*/g)?.map(t => t.trim()) || []

// create an AST from string input
const parse = (tokens: string[]): AST => {
  return { tag: "Dice", count: 1, sides: 20 }
}



export const Roll = {
  tokenize,
  parse: (input: string): AST => parse(tokenize(input))
}
