import React, { Component } from "react";
import Carte from "./Carte";

class Colonne extends Component {
  state = {};
  render() {
    return (
      <div className="col-md-3">
        <h3>{this.props.label}</h3>
        {this.props.cards.map(card => {
          return <Carte key={card.id} question={card.question} />;
        })}
      </div>
    );
  }
}

export default Colonne;
