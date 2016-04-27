import React from 'react'

class FileDetails extends React.Component {
  render () {
    const bytes = this.props.file.size ? this.formatBytes(this.props.file.size) : 0
    return (
      <h3>
        {this.props.file.name}
        <small>{bytes}</small>
        <small>{this.props.rowCount} rows</small>
      </h3>
    )
  }

  formatBytes (bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let i
    for (i = 0; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024
    }
    return bytes.toFixed(2) + units[i]
  }
}

FileDetails.propTypes = {
  file: React.PropTypes.object,
  rowCount: React.PropTypes.number
}

export default FileDetails
