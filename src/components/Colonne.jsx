import React, { Component } from "react";
import Carte from "./Carte";

class Colonne extends Component {
  state = {};
  render() {
    return (
      <div className="col-md-3">
        <h3>
          <button
            type="button"
            className="btn btn-success left"
            onClick={() => {
              this.props.onClickAddCard(this.props.id);
            }}
          >
            +
          </button>
          {this.props.label}
        </h3>
        {this.props.cards.map(card => {
          return (
            <Carte
              key={card.id}
              question={card.question}
              reponse={card.reponse}
              card={card}
              colonneId={this.props.id}
              colonne={this.props.colonne}
              onShowReponse={this.props.onShowReponse}
              onRemove={this.props.onRemove}
              show_reponse={card.show_reponse}
              user={this.props.user}
              successRemoveCard={this.props.successRemoveCard}
              failedRemoveCard={this.props.failedRemoveCard}
            />
          );
        })}
      </div>
    );
  }
}

export default Colonne;
