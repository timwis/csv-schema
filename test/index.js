import test from 'tape'

import {analyzeRow, detectType, determineWinner} from '../src/analyze'

test('detect type', function (t) {
  const tests = [
    ['', 'null'],
    ['2016-04-26', 'date'],
    ['2016-04-26T01:02:03Z', 'datetime'],
    ['1461668334', 'timestamp'],
    ['1.2', 'float'],
    ['true', 'boolean'],
    ['1', 'boolean'],
    ['2', 'integer'],
    ['a'.repeat(256), 'text'],
    ['foo', 'string']
  ]
  t.plan(tests.length)
  tests.map((testItem) => t.equal(detectType(testItem[0]), testItem[1], testItem[1]))
})

test('analyze row', function (t) {
  t.plan(6)

  const fieldsHash = {}
  const rows = [
    {beep: '1', boop: 'foo', bop: '2016-04-26'},
    {beep: '054', boop: '12', bop: '2009-01-01'}
  ]
  rows.map(analyzeRow.bind(null, fieldsHash))

  t.equal(fieldsHash.beep.typesFound.boolean, 1, 'detected boolean')
  t.equal(fieldsHash.beep.typesFound.integer, 1, 'detected integer')
  t.equal(fieldsHash.boop.typesFound.string, 1, 'detected string')
  t.equal(fieldsHash.boop.maxLength, 3, 'max length')
  t.equal(fieldsHash.bop.typesFound.date, 2, 'detected 2 dates')
  t.equal(fieldsHash.bop.sample, rows[0].bop, 'saved first sample')
})

test('determine winner', function (t) {
  t.plan(5)
  t.equal(determineWinner({float: 1}), 'float', 'single type detected')
  t.equal(determineWinner({string: 1, text: 1}), 'text', 'text over string')
  t.equal(determineWinner({integer: 3, string: 1}), 'string', 'string over integer')
  t.equal(determineWinner({integer: 3, float: 1}), 'float', 'float over integer')
  t.equal(determineWinner({timestamp: 3, integer: 1}), 'integer', 'integer over timestamp')
})
