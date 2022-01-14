// [ [Lexemas], [tokens] ]
// Palavras reservadas
const pr = [
  [
    'var',
    'const',
    'if',
    'while',
    'for',
    'break',
    'continue',
  ],
  [
    'VAR',
    'CONST',
    'IF',
    'WHL',
    'FOR',
    'BRK',
    'CONT',
  ],
]
// Delimitadores
const del = [
  [
    '(',
    ')',
    '[',
    ']',
    '{',
    '}',
    ',',
  ],
  [
    'EPAREN',
    'DPAREN',
    'ECOLC',
    'DCOLC',
    'ECHAV',
    'DCHAV',
    'VIRG',
  ],
]
// Identificadores
const id = /[a-z][a-z0-9]+/i
// Operadores
const op = [
  [
    '=',
    '+',
    '-',
    '*',
    '/',
    '==',
    '!=',
    '>=',
    '<=',
    '>',
    '<',
  ],
  [
    'ATR',
    'MAIS',
    'MENS',
    'VEZS',
    'DIV',
    'IGL',
    'DIF',
    'MAIG',
    'MNIG',
    'MAR',
    'MNR',
  ],
]
// Constantes
const cts = [
  /[0-9]+/, // números
  /('[^']*')|("[^"]*")/i, // strings
]

function analyser(str) {
  const out = []
  // Separando string em array
  let inp = str.trim().split('')
  // Uma entrada adicional para garantir
  // a correta execução da função reduce
  inp.push('')
  
  // Utilização a função reduce para iterar sobre o array
  inp.reduce((prev, cur, i) => {
    // Pulando espaços em branco
    if (prev === ' ') return ''
    // Identificação de palavras reservadas.
    // Necessitam de um espaço em branco em seguida
    if (pr[0].findIndex((p) => p === prev) !== -1 && (!cur || cur === ' ')) {
      const posicaoToken = pr[0].findIndex((p) => p === prev)
      out.push([prev, pr[1][posicaoToken]])
      return ''
    }
    // Identificação de delimitadores
    if (del[0].findIndex((d) => d === prev) !== -1) {
      const posicaoToken = del[0].findIndex((d) => d === prev)
      out.push([prev, del[1][posicaoToken]])
      return ''
    }
    // Identificação de identificadores.
    // Como a condição aqui detectaria palavras reservadas,
    // é necessário filtrá-las neste passo.
    if (id.test(prev)
      && !'var'.includes(prev)
      && !'const'.includes(prev)
      && !'if'.includes(prev)
      && !'while'.includes(prev)
      && !'for'.includes(prev)
      && !'break'.includes(prev)
      && !'continue'.includes(prev)) {
        // Para a identificação, espera-se que a palavra seja
        // seguida de um espaço em branco ou delimitador.
        for (d of del[0]) {
          if (cur === d || cur === ' ') {
            out.push([prev, `ID(${prev})`])
            return ''
          }
        }
        for (o of op[0]) {
          if (cur === o || cur === ' ') {
            out.push([prev, `ID(${prev})`])
            return ''
          }
        }
      }
    // Identificação de operadores. Aqui há uma segunda condição
    // para impedir que operadores de um caractere sejam confundidos
    // com operadores de dois.
    if (op[0].findIndex((o) => o === prev && !op[0].includes(cur)) !== -1) {
      const posicaoToken = op[0].findIndex((o) => o === prev)
      out.push([prev, op[1][posicaoToken]])
      return ''
    }
    // Identificação de constantes numéricas.
    if (cts[0].test(prev)) {
      for (d of del[0]) {
        if (cur === d || cur === ' ' || !cur) {
          out.push([prev, `NUM(${prev})`])
          return ''
        }
      }
      for (o of op[0]) {
        if (cur === o || cur === ' ' || !cur) {
          out.push([prev, `NUM(${prev})`])
          return ''
        }
      }
    }

    // Identificação de constantes strings.
    if (cts[1].test(prev)) {
      for (d of del[0]) {
        if (cur === d || cur === ' ' || !cur) {
          out.push([prev, `STR(${prev})`])
          return ''
        }
      }
      for (o of op[0]) {
        if (cur === o || cur === ' ' || !cur) {
          out.push([prev, `STR(${prev})`])
          return ''
        }
      }
    }
    // Caso a string inteira seja percorrida e ainda restarem
    // caracteres a serem analisados, assume-se que a linguagem
    // não reconhece a string
    if(i + 1 === inp.length && prev.length > 0) throw Error('Linguagem não reconhecida')
    // Retorno para composição dos caracteres em strings
    return prev + cur
  }, '')

  console.log(out)
}

analyser('const test = "aspas"')
// Prints
// [
//   [ 'const', 'CONST' ],
//   [ 'test', 'ID(test)' ],
//   [ '=', 'ATR' ],
//   [ '"aspas"', 'STR("aspas")' ]
// ]
analyser("const test = 'aspas'")
// [
//   [ 'const', 'CONST' ],
//   [ 'test', 'ID(test)' ],
//   [ '=', 'ATR' ],
//   [ "'aspas'", "STR('aspas')" ]
// ]
analyser('var num = 123')
// [
//   [ 'var', 'VAR' ],
//   [ 'num', 'ID(num)' ],
//   [ '=', 'ATR' ],
//   [ '123', 'NUM(123)' ]
// ]
analyser('if cond == 2')
// [
//   [ 'if', 'IF' ],
//   [ 'cond', 'ID(cond)' ],
//   [ '==', 'IGL' ],
//   [ '2', 'NUM(2)' ]
// ]
analyser('for test >= 7 break')
// [
//   [ 'for', 'FOR' ],
//   [ 'test', 'ID(test)' ],
//   [ '>=', 'MAIG' ],
//   [ '7', 'NUM(7)' ],
//   [ 'break', 'BRK' ]
// ]
analyser('for test != "this" continue')
// [
//   [ 'for', 'FOR' ],
//   [ 'test', 'ID(test)' ],
//   [ '!=', 'DIF' ],
//   [ '"this"', 'ID("this")' ],
//   [ 'continue', 'CONT' ]
// ]
