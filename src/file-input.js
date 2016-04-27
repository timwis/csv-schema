import React from 'react'

class FileInput extends React.Component {
  render () {
    return (
      <div className='input-group'>
        <input type='file' ref='fileInput' accept='text/csv,application/csv,text/comma-separated-values,text/tsv,text/tab-separated-values' className='form-control' />
        <span className='input-group-btn'>
          <button onClick={() => this.props.onSendFile(this.refs.fileInput.files[0] || {})} className='btn btn-primary'>Analyze</button>
        </span>
      </div>
    )
  }
}

FileInput.propTypes = {
  onSendFile: React.PropTypes.func
}

export default FileInput
