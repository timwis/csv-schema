import React from 'react'
import Knex from 'knex'

export default React.createClass({
  exportTypes: [
    {value: 'mysql', label: 'MySQL'},
    {value: 'mariadb', label: 'MariaDB'},
    {value: 'postgres', label: 'Postgres'},
    {value: 'oracle', label: 'Oracle'},
    {value: 'sqlite3', label: 'SQLite3'}
  ],
  getInitialState: function () {
    return {
      exportType: 'mysql'
    }
  },
  render: function () {
    const tableName = this.props.file.name ? this.props.file.name.split('.')[0] : 'table_name'
    const enabledFields = this.props.fields.filter((field) => field.enabled)
    const exportResult = this.exportSql(tableName, enabledFields, this.state.exportType)
    return (
      <div>
        <ul className='nav nav-tabs'>
          {this.exportTypes.map((type) => (
            <li key={type.value} className={this.state.exportType === type.value ? 'active' : ''}>
              <a href='#' onClick={this.setExportType.bind(null, type.value)}>{type.label}</a>
            </li>
          ))}
        </ul>
        <div className='well export-result'>{exportResult}</div>
      </div>
    )
  },
  setExportType: function (exportType, event) {
    this.setState({exportType})
    event.preventDefault()
  },
  exportSql: function (tableName, fields, client) {
    const knex = Knex({ client: client })

    const sql = knex.schema.createTable(tableName, function (table) {
      fields.forEach(function (field) {
        let column
        if (field.type === 'string') {
          column = table.string(field.machineName, field.maxLength)
        } else if (table[field.type] !== undefined) {
          column = table[field.type](field.machineName)
        } else {
          column = table.specificType(field.type, field.machineName)
        }
        if (field.nullable) column.nullable()
      })
    })
    return sql.toString()
  },
  propTypes: {
    file: React.PropTypes.object,
    fields: React.PropTypes.array
  }
})
