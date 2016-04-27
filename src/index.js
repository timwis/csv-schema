import React from 'react'
import ReactDOM from 'react-dom'
import Papa from 'papaparse'
import NProgress from 'nprogress'

import FileInput from './file-input'
import SchemaTable from './schema-table'
import FileDetails from './file-details'
import ExportMenu from './export-menu'
import {analyzeRow, analyzeRowResults} from './analyze'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: {},
      fields: [],
      rowCount: 0
    }
    this.onUserInput = this.onUserInput.bind(this)
    this.onSendFile = this.onSendFile.bind(this)
  }

  render () {
    const isFileSet = this.state.file.name
    return (
      <div>
        <h1>CSV Schema</h1>
        <p>Analyzes a CSV file and generates database table schema, all within the browser</p>
        <FileInput onSendFile={this.onSendFile} />
        {isFileSet && <FileDetails file={this.state.file} rowCount={this.state.rowCount} />}
        {isFileSet && <ExportMenu file={this.state.file} fields={this.state.fields} />}
        {isFileSet && <SchemaTable fields={this.state.fields} onUserInput={this.onUserInput} />}
      </div>
    )
  }

  onUserInput (key, field, value) {
    const newFields = this.state.fields.slice()
    if (newFields[key]) newFields[key][field] = value
    this.setState({fields: newFields})
  }

  onSendFile (file) {
    const fieldsHash = {}
    let rowCount = 0

    this.setState({file})

    NProgress.start()
    const startTime = new Date().getTime()

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      step: (row) => {
        rowCount++
        analyzeRow(fieldsHash, row.data[0])
      },
      complete: () => {
        const fieldsArray = analyzeRowResults(fieldsHash)

        NProgress.done()
        const endTime = new Date().getTime()
        console.log('total time', endTime - startTime)

        this.setState({ fields: fieldsArray, rowCount })
      }
    })
  }
}

if (document) ReactDOM.render(<App />, document.getElementById('main'))
