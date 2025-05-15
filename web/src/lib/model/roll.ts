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
  const [count, sides] = s.split('d').map(Number);
  return { tag: "Dice", count, sides } as AST;
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

// Usage:
const parse = (s: string) => expr(s.trim())?.[0];

export const Roll = {
  tokenize,
  parse
}
