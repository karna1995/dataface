/* global Event */
const test = require('tape')
require('jsdom-global')()

const models = {
  db: require('../src/models/db')
}

const views = {
  connect: require('../src/views/connect')
}

test('connect view sends form values as payload on submit', (t) => {
  t.plan(1)
  const state = { db: { config: {} } }
  const sample = {
    hostname: 'localhost',
    username: 'root',
    password: 'lolol',
    database: 'cake'
  }
  const send = (type, action) => {
    t.deepEqual(action.payload, sample, 'payload matches form values')
  }
  const tree = views.connect(null, state, send)
  tree.querySelector('#hostname').value = sample.hostname
  tree.querySelector('#username').value = sample.username
  tree.querySelector('#password').value = sample.password
  tree.querySelector('#database').value = sample.database
  tree.querySelector('form').dispatchEvent(new Event('submit'))
})

test('db model', (t) => {
  t.plan(2)
  const reducers = models.db.reducers
  const tables = ['foo', 'bar']
  const result = reducers.receiveNewTable({ name: 'baz' }, {tables})
  t.equal(result.tables.length, 3, 'tables array grew by 1')
  t.equal(result.tables[2], 'baz', 'new table appended to end')
})
