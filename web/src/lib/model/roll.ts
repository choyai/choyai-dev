type AST = Dice | Add | Subtract | Constant

type Tag = "Dice" | "Add" | "Subtract" | "Constant"

interface BaseAST {
  tag: Tag
}
type DiceType = 2 | 4 | 6 | 8 | 10 | 12 | 20 | 100
const allowedDice: Record<DiceType, null> = {
  2: null,
  4: null,
  6: null,
  8: null,
  10: null,
  12: null,
  20: null,
  100: null
}

interface Dice extends BaseAST {
  tag: "Dice"
  count: number
  sides: DiceType
}

interface Add extends BaseAST {
  tag: "Add"
  left: AST
  right: AST
}

interface Subtract extends BaseAST {
  tag: "Subtract"
  left: AST
  right: AST
}

interface Constant extends BaseAST {
  tag: "Constant"
  value: number
}

const tokenize = (input: string): string[] =>
  input.match(/\s*(\d+d\d+|\d+|[()+-])\s*/g)?.map(t => t.trim()) || []

type Parser<T> = (input: string) => [T, string] | null;

const regex = (r: RegExp): Parser<string> => input => {
  const match = input.match(r);
  return match ? [match[0], input.slice(match[0].length).trimStart()] : null;
};

const alt = <T>(...parsers: Parser<T>[]): Parser<T> => input => {
  for (const p of parsers) {
    const result = p(input);
    if (result) return result;
  }
  return null;
};

const seq = <A, B>(pa: Parser<A>, pb: Parser<B>): Parser<[A, B]> => input => {
  const resA = pa(input);
  if (!resA) return null;
  const resB = pb(resA[1]);
  if (!resB) return null;
  return [[resA[0], resB[0]], resB[1]];
};

const map = <A, B>(p: Parser<A>, f: (a: A) => B): Parser<B> => input => {
  const res = p(input);
  return res ? [f(res[0]), res[1]] : null;
};

const number = map(regex(/^\d+/), Number);
const dice = map(regex(/^\d+d\d+/), s => {
  const [count, n]: number[] = s.split('d').map(Number);
  // TODO: unhappy path programming in Effect or just Effect.Schema
  // const sides: DiceType = new Set(Object.keys(allowedDice).map(Number)).has(n) ? n : undefined
  return { tag: "Dice", count, sides: n } as AST;
});
const constant = map(number, value => ({ tag: "Constant", value } as AST));
const parens = (expr: Parser<AST>): Parser<AST> =>
  map(seq(seq(regex(/^\(/), expr), regex(/^\)/)), ([[, ast]]) => ast);

const primary = (expr: Parser<AST>): Parser<AST> => alt(dice, constant, parens(expr));

const operator = regex(/^[+-]/);
const binary = (left: AST, [op, right]: [string, AST]): AST => ({
  tag: op === '+' ? 'Add' : 'Subtract',
  left,
  right,
});

const expr: Parser<AST> = input => {
  const res = primary(expr)(input);
  if (!res) return null;

  let [left, rest] = res;

  while (true) {
    const next = seq(operator, primary(expr))(rest);
    if (!next) break;
    left = binary(left, next[0]);
    rest = next[1];
  }
  return [left, rest];
};

const parse = (s: string) => expr(s.trim())?.[0];

const randomDice = (sides: number): number => {
  return Math.min(Math.floor(Math.random() * (sides)) + 1, sides)
}

const evaluate = (node: AST): number => {
  switch (node.tag) {
    case "Dice": {
      const rolls = new Array(node.count).fill(0)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return rolls.map(_ => randomDice(node.sides)).reduce((acc, curr) => acc + curr, 0)
    }
    case "Add":
      return evaluate(node.left) + evaluate(node.right)
    case "Subtract":
      return evaluate(node.left) - evaluate(node.right)
    case "Constant":
      return node.value
  }
}

export const Roll = {
  tokenize,
  parse,
  evaluate
}
