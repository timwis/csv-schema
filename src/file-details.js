import React from 'react'

import {formatBytes} from './util'

export default React.createClass({
  render: function () {
    const bytes = this.props.file.size ? formatBytes(this.props.file.size) : 0
    return (
      <h3>{this.props.file.name} <small>{bytes}</small> <small>{this.props.rowCount} rows</small></h3>
    )
  },
  propTypes: {
    file: React.PropTypes.object,
    rowCount: React.PropTypes.number
  }
})
