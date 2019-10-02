import React, { Component } from "react";
import Carte from "./Carte";

class Colonne extends Component {
  state = {};
  render() {
    return (
      <section className="section-card mt-4">
        <h3>
          <button
            type="button"
            title="Ajouter une carte"
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
              colonne={this.props.colonne}
              onShowReponse={this.props.onShowReponse}
              onRemove={this.props.onRemove}
              onMoveCard={this.props.onMoveCard}
              onClickEditCard={this.props.onClickEditCard}
              show_reponse={card.show_reponse}
              user={this.props.user}
              successRemoveCard={this.props.successRemoveCard}
              failedRemoveCard={this.props.failedRemoveCard}
            />
          );
        })}
      </section>
    );
  }
}

export default Colonne;
