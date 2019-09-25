import React, { Component } from 'react';

class Carte extends Component {
  state = {  }
  render() {
    return (
      <div>
        <h4>{this.props.question}</h4>
      </div>
     );
  }
}

export default Carte;