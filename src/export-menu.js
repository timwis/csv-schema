import React from 'react'
import Knex from 'knex'
import {partial} from 'lodash'

export default React.createClass({
  getExportTypes: function () {
    return {
      'MySQL': partial(this.exportSql, 'mysql'),
      'MariaDB': partial(this.exportSql, 'mariadb'),
      'Postgres': partial(this.exportSql, 'postgres'),
      'Oracle': partial(this.exportSql, 'oracle'),
      'SQLite3': partial(this.exportSql, 'sqlite3'),
      'JSON Table Schema': this.exportJSONTableSchema
    }
  },
  getInitialState: function () {
    return {
      exportType: 'MySQL'
    }
  },
  render: function () {
    const enabledFields = this.props.fields.filter((field) => field.enabled)
    const exportTypes = this.getExportTypes()
    const exportResult = exportTypes[this.state.exportType](enabledFields)
    const tabs = []
    for (let type in exportTypes) {
      tabs.push((
        <li key={type} className={this.state.exportType === type ? 'active' : ''}>
          <a href='#' onClick={this.setExportType.bind(null, type)}>{type}</a>
        </li>
      ))
    }

    return (
      <div>
        <ul className='nav nav-tabs'>
          {tabs}
        </ul>
        <div className='well export-result'>{exportResult}</div>
      </div>
    )
  },
  setExportType: function (exportType, event) {
    this.setState({exportType})
    event.preventDefault()
  },
  exportJSONTableSchema: function (fields) {
    const typeMap = {
      float: 'number',
      text: 'string'
    }
    return fields.map((field) => {
      const jtsField = {
        name: field.machineName,
        type: typeMap[field.type] || field.type,
        constraints: {
          required: !field.nullable
        }
      }
      if (field.type === 'string') {
        jtsField.constraints.maxLength = field.type.maxLength
      }
      return JSON.stringify(jtsField, null, 2)
    })
  },
  exportSql: function (client, fields) {
    const tableName = this.props.file.name ? this.props.file.name.split('.')[0] : 'table_name'
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
