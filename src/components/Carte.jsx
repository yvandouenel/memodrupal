import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";

class Carte extends Component {
  state = {};
  render() {
    return (
      <div
        className="bg-secondary text-light p-2 mb-2 mt-4 rounded carte"
        id={this.props.card.id}
      >
        <div className="float-right cursor-pointer arrow" title="Déplacer la carte">
          <IoIosArrowDropright
            onClick={() =>
              this.props.onMoveCard(
                this.props.card,
                this.props.colonne,
                "right"
              )
            }
          />
        </div>
        <div className="float-left cursor-pointer arrow" title="Déplacer la carte">
          <IoIosArrowDropleft
            onClick={() =>
              this.props.onMoveCard(
                this.props.card,
                this.props.colonne,
                "left"
              )
            }
          />
        </div>
        <h4
          className="card-question pl-50"
          title="Voir la réponse / modifier la carte"
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
                    this.props.colonne
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
