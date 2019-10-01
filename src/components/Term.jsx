import React, { Component } from "react";
class Term extends Component {
  state = {};
  render() {
    let classes = (this.props.selected) ? "btn btn-warning m-2" : "btn btn-secondary m-2";
    return (
      <button
        onClick={e => {
          this.props.onClick(
            this.props.id,
            this.props.onSuccess,
            this.props.onFailed
          );
        }}
        className={classes}
        id={this.props.id}
      >
        {this.props.label}
      </button>
    );
  }
}

export default Term;
