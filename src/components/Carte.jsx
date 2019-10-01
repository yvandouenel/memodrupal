import React, { Component } from "react";
import Button from "react-bootstrap/Button";

class Carte extends Component {
  state = {};
  render() {
    return (
      <div
        className="bg-secondary text-light p-2 mb-2 rounded"
        id={this.props.card.id}
      >
        <h4
          className=""
          onClick={e => {
            this.props.onShowReponse(e, this.props.card, this.props.colonne);
          }}
        >
          {this.props.question}
        </h4>
        {this.props.show_reponse && (
          <div>
            <h3 className="panel-footer reponse border-left border-success m-2 p-2">
              {this.props.reponse_html && <div>this.props.reponse</div>}
              {!this.props.reponse_html && this.props.reponse}
            </h3>
            <div className="pl-4">
              <Button
                variant="primary"
                onClick={e => {
                  this.props.onClickEditCard(
                    e,
                    this.props.card,
                    this.props.colonne,
                  );
                }}
              >
                Modifier
              </Button>
              <Button
                variant="warning"
                onClick={() =>
                  this.props.onRemove(
                    this.props.card.id,
                    this.props.user.uname,
                    this.props.user.upwd,
                    this.props.successRemoveCard,
                    this.props.failedRemoveCard
                  )
                }
                className="ml-4 bg-danger text-white"
              >
                Supprimer
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Carte;
