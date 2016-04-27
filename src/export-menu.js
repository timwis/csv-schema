import React from 'react'
import Knex from 'knex'

class ExportMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {exportType: 'MySQL'}
  }

  get exportTypes () {
    return {
      'MySQL': this.exportSql.bind(this, 'mysql'),
      'MariaDB': this.exportSql.bind(this, 'mariadb'),
      'Postgres': this.exportSql.bind(this, 'postgres'),
      'Oracle': this.exportSql.bind(this, 'oracle'),
      'SQLite3': this.exportSql.bind(this, 'sqlite3'),
      'JSON Table Schema': this.exportJSONTableSchema.bind(this)
    }
  }

  render () {
    const enabledFields = this.props.fields.filter((field) => field.enabled)
    const exportResult = this.exportTypes[this.state.exportType](enabledFields)
    const tabs = []
    for (let type in this.exportTypes) {
      tabs.push((
        <li key={type} className={this.state.exportType === type ? 'active' : ''}>
          <a href='#' onClick={this.setExportType.bind(this, type)}>{type}</a>
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
  }

  setExportType (exportType, event) {
    this.setState({exportType})
    event.preventDefault()
  }

  exportJSONTableSchema (fields) {
    const typeMap = {
      float: 'number',
      text: 'string'
    }
    const jtsFields = fields.map((field) => {
      const fieldType = typeMap[field.type] || field.type
      const jtsField = {
        name: field.machineName,
        type: fieldType,
        constraints: {
          required: !field.nullable
        }
      }
      if (fieldType === 'string') {
        jtsField.constraints.maxLength = field.maxLength
      }
      return jtsField
    })
    return JSON.stringify({fields: jtsFields}, null, 2)
  }

  exportSql (client, fields) {
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
  }
}

ExportMenu.propTypes = {
  file: React.PropTypes.object,
  fields: React.PropTypes.array
}

export default ExportMenu
