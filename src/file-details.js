import React from 'react'

export default React.createClass({
  render: function () {
    const bytes = this.props.file.size ? formatBytes(this.props.file.size) : 0
    return (
      <h3>
        {this.props.file.name}
        <small>{bytes}</small>
        <small>{this.props.rowCount} rows</small>
      </h3>
    )
  },
  propTypes: {
    file: React.PropTypes.object,
    rowCount: React.PropTypes.number
  }
})

function formatBytes (bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let i
  for (i = 0; bytes >= 1024 && i < 4; i++) {
    bytes /= 1024
  }
  return bytes.toFixed(2) + units[i]
}

