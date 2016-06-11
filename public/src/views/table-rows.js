// const choo = require('choo')

const dataGrid = require('./data-grid')

module.exports = (params, state, send) => {
  const table = params.name
  if (table && state.db.instance && state.db.selectedTable.name !== params.name) {
    send('db:getTable', { name: table })
  }

  const { fields, rows, primaryKey, selectedRowIndex } = state.db.selectedTable
  const fieldsObject = fields.map((field) => ({ key: field.name, editable: (field.name !== primaryKey) }))

  return dataGrid({
    fields: fieldsObject,
    rows,
    selectedRowIndex,
    onSelectRow: (index) => send('db:setSelectedRow', {index}),
    onUpdateRow: (index, payload) => send('db:updateRow', {index, table, payload}),
    onInsertRow: (payload) => send('db:insertRow', {table, payload})
  })
}
