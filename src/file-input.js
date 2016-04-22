import React from 'react'

export default React.createClass({
  render: function () {
    return (
      <div className='input-group'>
        <input type='file' ref='fileInput' accept='text/csv,application/csv,text/comma-separated-values,text/tsv,text/tab-separated-values' className='form-control' />
        <span className='input-group-btn'>
          <button onClick={this.parse} className='btn btn-primary'>Analyze</button>
        </span>
      </div>
    )
  },
  parse: function (e) {
    const file = this.refs.fileInput.files[0] || null
    this.props.onSendFile(file)
  },
  propTypes: {
    onSendFile: React.PropTypes.func
  }
})
