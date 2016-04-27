import React from 'react'
import {partial} from 'lodash'

class SchemaTable extends React.Component {
  get fieldTypes () {
    return [
      'string',
      'text',
      'boolean',
      'integer',
      'float',
      'date',
      'datetime',
      'timestamp'
    ]
  }

  render () {
    return (
      <table className='table table-striped schema-table'>
        <thead>
          <tr>
            <th className='field'>Field</th>
            <th className='machine-name'>Name</th>
            <th className='type'>Type</th>
            <th className='length'>Length</th>
            <th className='nullable'>Null</th>
            <th className='sample'>Sample</th>
          </tr>
        </thead>
        <tbody>
          {this.props.fields.map((field, index) => {
            // Construct field type explanation hint
            const typeHints = []
            for (let type in field.typesFound) {
              typeHints.push(`${type} (${field.typesFound[type]})`)
            }

            // Construct onChange event handlers for each field
            const onChangeRow = partial(this.props.onUserInput, index)
            const onChange = {
              enabled: (e) => onChangeRow('enabled', e.target.checked),
              machineName: (e) => onChangeRow('machineName', e.target.value),
              type: (e) => onChangeRow('type', e.target.value),
              maxLength: (e) => onChangeRow('maxLength', e.target.value),
              nullable: (e) => onChangeRow('nullable', e.target.checked)
            }

            const rowClassName = field.enabled ? '' : 'disabled'
            return (
              <tr key={index} className={rowClassName}>
                <td className='field'>
                  <div className='checkbox'>
                    <label>
                      <input type='checkbox' defaultChecked={field.enabled} onChange={onChange.enabled} />
                      {field.sourceName}
                    </label>
                  </div>
                </td>
                <td className='machine-name'>
                  <input type='text' defaultValue={field.machineName} onChange={onChange.machineName} className='form-control' />
                </td>
                <td className='type'>
                  <span className='hint--top' data-hint={typeHints.join(', ')}>
                    <i className='fa fa-question-circle'></i>
                  </span>
                  <select defaultValue={field.type} onChange={onChange.type} className='form-control'>
                    {this.fieldTypes.map((fieldType) => (
                      <option key={fieldType} value={fieldType}>{fieldType}</option>
                    ))}
                  </select>
                </td>
                <td className='length'>
                  <input type='text' defaultValue={field.maxLength} onChange={onChange.maxLength} className='form-control' />
                </td>
                <td className='nullable'>
                  <input type='checkbox' defaultChecked={field.nullable} onChange={onChange.nullable} />
                </td>
                <td className='sample'>
                  <code>{field.sample}</code>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

SchemaTable.propTypes = {
  fields: React.PropTypes.array,
  onUserInput: React.PropTypes.func
}

export default SchemaTable
