import React, { Component } from 'react';
class Term extends Component {
  state = {  }
  render() {
    return (
      <button className="btn btn-secondary m-2" id={this.props.id}>{this.props.label}</button>
    );
  }
}

export default Term;