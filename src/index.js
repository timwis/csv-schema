import React from 'react'
import ReactDOM from 'react-dom'
import Papa from 'papaparse'
import slug from 'slug'
import NProgress from 'nprogress'

import FileInput from './file-input'
import SchemaTable from './schema-table'
import FileDetails from './file-details'
import ExportMenu from './export-menu'
import {detectType, determineWinner} from './util'

const App = React.createClass({
  render: function () {
    const isFileSet = this.state.file.name
    return (
      <div>
        <h1>CSV Schema</h1>
        <p>Analyzes a CSV file and generates database table schema, all within the browser</p>
        <FileInput onSendFile={this.onSendFile} />
        {isFileSet ? <FileDetails file={this.state.file} rowCount={this.state.rowCount} /> : ''}
        {isFileSet ? <ExportMenu file={this.state.file} fields={this.state.fields} /> : ''}
        {isFileSet ? <SchemaTable fields={this.state.fields} onUserInput={this.onUserInput} /> : ''}
      </div>
    )
  },
  getInitialState: function () {
    return {
      file: {},
      fields: [],
      rowCount: 0
    }
  },
  onUserInput: function (key, field, value) {
    const newFields = this.state.fields.slice()
    if (newFields[key]) newFields[key][field] = value
    this.setState({fields: newFields})
  },
  onSendFile: function (file) {
    this.setState({file})
    NProgress.start()
    this.startTime = new Date().getTime()
    this.analyze(file).then((fields) => {
      const endTime = new Date().getTime()
      NProgress.done()
      console.log('finished', endTime - this.startTime)
      this.setState(fields)
      // this.setState.bind(this))
    })
  },
  analyze: function (file) {
    var fieldsHash = {}
    var rowCount = 0

    return new Promise(function (resolve, reject) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        worker: true,
        step: function (row) {
          rowCount++

          for (let key in row.data[0]) {
            const fieldType = detectType(row.data[0][key])
            if (!fieldsHash[key]) fieldsHash[key] = { fieldTypes: {}, sample: null, maxLength: 0, enabled: true }
            const field = fieldsHash[key]

            // Tally the presence of this field type
            if (!field.fieldTypes[fieldType]) field.fieldTypes[fieldType] = 0
            field.fieldTypes[fieldType]++

            // // Set nullable
            if (fieldType === 'null' && !field.nullable) {
              field.nullable = true
            }

            // Save a sample record if there isn't one already (earlier rows might have an empty value)
            if (!field.sample && row.data[0][key]) {
              field.sample = row.data[0][key]
            }

            // Save the largest length
            field.maxLength = Math.max(field.maxLength, row.data[0][key].length)
          }
        },
        complete: function () {
          let fieldsArray = []
          for (let key in fieldsHash) {
            const field = fieldsHash[key]
            // Determine which field type wins
            field.fieldType = determineWinner(field.fieldTypes)
            field.machineName = slug(key, {
              replacement: '_',
              lower: true
            })
            field.sourceName = key
            fieldsArray.push(field)
          }
          console.log(rowCount)
          resolve({ fields: fieldsArray, rowCount })
        }
      })
    })
  }
})

if (document) ReactDOM.render(<App />, document.getElementById('main'))
