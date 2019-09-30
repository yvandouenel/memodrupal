import React, { Component } from "react";
class Term extends Component {
  state = {};
  render() {
    return (
      <button
        onClick={e => {
          this.props.onClick(
            this.props.id,
            this.props.onSuccess,
            this.props.onFailed
          );
        }}
        className="btn btn-secondary m-2"
        id={this.props.id}
      >
        {this.props.label}
      </button>
    );
  }
}

export default Term;
