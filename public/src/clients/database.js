/**
 * Generic database client
 * Like a "base class" for database clients. Some methods will
 * work across all clients (via Knex.js) and do not need to be
 * extended. Some methods do not have Knex.js support and thus
 * must be hard-coded for each client. Extend this class via:
 * Object.assign(Object.create(parentClass), subClass)
 */
module.exports = {
  validTypes: [],

  getTables: (connection) => {
    throw new Error('getTables method not implemented')
  },

  createTable: (connection, table) => {
    return connection.schema.createTable(table, () => {})
  },

  deleteTable: (connection, table) => {
    return connection.schema.dropTable(table)
  },

  getSchema: (connection, table) => {
    return connection(table).columnInfo()
  },

  getPrimaryKey: (connection, table) => {
    throw new Error('getPrimaryKey method not implemented')
  },

  insertColumn: (connection, table, payload) => {
    const bindings = Object.assign({}, payload, {table})
    const sql = [`
      ALTER TABLE :table:
      ADD COLUMN :name: ${payload.type}`
    ]
    if (payload.maxLength) sql.push(`(${+payload.maxLength})`)
    if (payload.nullable === 'false') sql.push('NOT NULL')
    if (payload.defaultValue) sql.push('DEFAULT :defaultValue')
    return connection.raw(sql.join(' '), bindings)
  },

  updateColumn: (connection, table, column, changes) => {
    throw new Error('updateColumn method not implemented')
  },

  renameColumn: (connection, table, column, newName) => {
    const query = connection.schema.table(table, (t) => {
      t.renameColumn(column, newName)
    })
    return query
  },

  deleteColumn: (connection, table, column) => {
    return connection.schema.table(table, (t) => {
      t.dropColumn(column)
    })
  },

  getRows: (connection, table, limit, offset) => {
    return connection.select().from(table).limit(limit).offset(offset)
  },

  getRowCount: (connection, table) => {
    return connection.count().from(table)
      .then((results) => results.length > 0 ? results[0].count : null)
  },

  updateRow: (connection, table, payload, conditions) => {
    return connection(table).where(conditions).update(payload).limit(1)
  },

  insertRow: (connection, table, payload) => {
    return connection(table).insert(payload, '*')
  },

  deleteRow: (connection, table, conditions) => {
    return connection(table).where(conditions).del().limit(1)
  }
}