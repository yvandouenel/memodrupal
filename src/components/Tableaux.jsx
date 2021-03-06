import React, { Component } from "react";
import Coopernet from "./Coopernet";
import Term from "./Term";
import Colonne from "./Colonne";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { GiBrainTentacle } from "react-icons/gi";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";

class Tableaux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coopernet: new Coopernet(),
      userIsLogged: false,
      addingACard: false,
      editingACard: false,
      msgError: "",
      terms: [],
      colonnes: [] //ici sont stockées les colonnes et les cartes
    };
    this.dumpModal = true;
    this.themeId = 0;
    this.columnId = 0;
    this.editedCard = null;
    this.editedColumn = null;
  }
  // Permet d'appeler la méthode une fois que me composant est "monté"
  componentDidMount() {
    this.isLogged();
  }
  unlog = () => {
    console.log("Dans unlog");
    const state = { ...this.state };
    state.userIsLogged = false;
    this.setState(state);
  };
  /**
   * Teste si l'utilisateur n'est pas déjà logé
   * Fonction visiblement valable uniquement quand l'appel a lieu
   * depuis le même nom de domaine
   */
  isLogged = () => {
    console.log("Dans isLogged ?");
    // Appel de la fonction
    this.state.coopernet.isLogged(this.successLog, this.failedLog);
  };
  /**
   * Récupère l'index de la colonne actuelle puis l'index de la colonne
   * précédente ou suivante puis récupère l'index du term de tanonomie
   * pour le donner en paramètre à la fonction qui est chargée de modifier
   * la carte
   */
  moveCard = (card, column, direction) => {
    console.log("Dans moveCard");
    //console.log(card,column,direction);

    // récupération de l'index de la colonne
    const current_column_index = this.state.colonnes.indexOf(column);
    console.log("index de la colonne : ", current_column_index);
    let new_index_drupal_column = 0;

    switch (direction) {
      case "right":
        // récupération de l'index suivant
        const next_column_index = (current_column_index + 1) % 4;
        console.log("index suivant : ", next_column_index);
        new_index_drupal_column = this.state.colonnes[next_column_index].id;
        break;
      case "left":
        // récupération de l'index précédent
        let previous_column_index = (current_column_index - 1) % 4;
        previous_column_index =
          previous_column_index === -1 ? 3 : previous_column_index;
        console.log("index précédent : ", previous_column_index);
        new_index_drupal_column = this.state.colonnes[previous_column_index].id;
        break;
      default:
        console.log("Pb dans moveCard " + direction + ".");
    }
    console.log("nouvel index de la carte : ", new_index_drupal_column);
    this.state.coopernet.createReqEditColumnCard(
      card.id,
      this.state.coopernet.user.uname,
      this.state.coopernet.user.upwd,
      new_index_drupal_column,
      this.themeId,
      this.successEditColumnCard,
      this.failedEditColumnCard
    );
  };
  /**
   * Sert aussi bien dans le cas où l'utilisateur est déjà logé
   * ou dans le cas où il vient de se loger via le formulaire
   */
  successLog = () => {
    console.log("Dans successLog");
    const state = { ...this.state };
    console.log(
      "user : ",
      this.state.coopernet.user.uid,
      this.state.coopernet.user.uname,
    );
    state.userIsLogged = true;
    state.msgError = "";
    this.setState(state);
    // création de la requête pour obtenir les thématiques
    this.state.coopernet.createReqTerms(this.successTerms, this.failedTerms);
  };
  successEditColumnCard = themeid => {
    console.log("Dans successEditColumnCard");
    // Rappel de la fonction qui va chercher la liste des cartes pour une thématique
    this.state.coopernet.createReqCards(
      themeid,
      this.successCards,
      this.failedCards
    );
  };
  failedEditColumnCard = () => {
    console.log("Dans failedEditColumnCard");
  };
  successEditCard = themeid => {
    console.log("Dans successEditCard");
    // Rappel de la fonction qui va chercher la liste des cartes pour une thématique
    this.state.coopernet.createReqCards(
      themeid,
      this.successCards,
      this.failedCards
    );
  };

  failedEditCard = () => {
    console.log("Dans failedEditCard");
  };
  successAddCard = themeid => {
    console.log("Dans successAddCard");
    // Rappel de la fonction qui va chercher la liste des cartes pour une thématique
    this.state.coopernet.createReqCards(
      themeid,
      this.successCards,
      this.failedCards
    );
  };
  failedAddCard = () => {
    console.log("Dans failedAddCard");
  };
  successRemoveCard = () => {
    console.log("Dans successRemoveCard " + this.themeId);
    // Rappel de la fonction qui va chercher la liste des cartes pour une thématique
    this.state.coopernet.createReqCards(
      this.themeId,
      this.successCards,
      this.failedCards
    );
  };
  failedRemoveCard = () => {
    console.log("Dans failedRemoveCard");
  };
  successTerms = terms => {
    console.log("Dans successTerms");
    console.log("Termes : ", terms);
    const state = { ...this.state };
    state.terms = terms;
    this.setState(state);
  };
  failedTerms = () => {
    console.log("Dans failedTerms");
  };
  successCards = (cols, termId) => {
    console.log("Dans successCards");
    cols.sort((a, b) => a.id - b.id);
    console.log("Colonnes : ", cols);
    const state = { ...this.state };
    state.colonnes = cols;

    // on sait maintenant quel term (thématique) est affiché
    this.themeId = termId;
    // remise à zéro des term sélectionnés
    state.terms.forEach(element => {
      element.selected = false;
    });
    // récupération de l'index du terme concerné pour changer la propriété "selected"
    let term_index = state.terms.findIndex(element => {
      return element.id === termId;
    });
    state.terms[term_index].selected = true;

    this.setState(state);
  };
  failedCards = () => {
    console.log("Dans failedCards");
  };
  failedLog = (msg = "") => {
    console.log("Dans failedLog");
    const state = { ...this.state };
    state.userIsLogged = false;
    if (msg) state.msgError = msg;
    this.setState(state);
  };
  handleSubmitAddOrEditCard = (event, editedCard = false) => {
    console.log("dans handleSubmitAddOrEditCard - edit = ", editedCard);

    event.preventDefault();
    // récupération des éléments du formulaire
    const inputQuestion = document.getElementById("inputquestion").value;
    const inputReponse = document.getElementById("inputreponse").value;

    if (!editedCard) {
      this.state.coopernet.createReqAddCards(
        this.state.coopernet.user.uname,
        this.state.coopernet.user.upwd,
        inputQuestion,
        inputReponse,
        this.themeId,
        this.numCol,
        this.successAddCard,
        this.failedAddCard
      );
    } else {
      // appel de la fonction de modification
      console.log(
        "dans handleSubmitAddOrEditCard : appel de createReqEditCard"
      );
      // arguments num_card,login,pwd,question,reponse,themeid,columnid,callbackSuccess,callbackFailed
      console.log("num_card = ", editedCard.id);
      console.log("login = ", this.state.coopernet.user.uname);
      console.log("question = ", editedCard.question);
      console.log("reponse = ", editedCard.reponse);
      console.log("themeid = ", this.themeId);
      console.log("columnid = ", editedCard.colonne);
      this.state.coopernet.createReqEditCard(
        editedCard.id,
        this.state.coopernet.user.uname,
        this.state.coopernet.user.upwd,
        editedCard.question,
        editedCard.reponse,
        this.themeId,
        editedCard.colonne,
        this.successEditCard,
        this.failedEditCard
      );
    }

    const state = { ...this.state };
    state.addingACard = false;
    state.editingACard = false;
    this.editedCard = null;
    this.editedColumn = null;
    this.setState(state);
  };
  handleCloseForm = event => {
    console.log("dans handleCloseForm");
    const state = { ...this.state };
    state.addingACard = false;
    state.editingACard = false;
    this.editedCard = null;
    this.editedColumn = null;
    this.setState(state);
  };
  dumpFormAddOrEditCard = () => {
    console.log("Dans dumpFormAddOrEditCard");
    console.log(this.state.editingACard);
    if (this.state.addingACard || this.state.editingACard) {
      let edit = this.state.editingACard ? this.editedCard : false;
      console.log(
        "addingACard = ",
        this.state.addingACard,
        "editingACard = ",
        this.state.editingACard,
        "theme = " + this.themeId
      );
      return (
        <Modal show={this.dumpModal} size="lg" className="modal-large">
          <Modal.Header>
            <Modal.Title>Modifier une question et/ou une réponse</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {
              /* formulaire ici */
              <form id="add-or-edit-card"
                onSubmit={e => {
                  this.handleSubmitAddOrEditCard(e, edit);
                }}
              >
              <div id="div-question" className="div-label-form">
                <label className="label-large">
                  <div>Question :</div>
                  {this.state.addingACard && (
                    <input
                      type="text"
                      id="inputquestion"
                      autoFocus
                      className="ml-4 input-large"
                    />
                  )}
                  {this.state.editingACard && (
                    <input
                      onChange={e => this.handleChangeCard(e, this.editedCard)}
                      type="text"
                      id="inputquestion"
                      autoFocus
                      className="ml-4 input-large"
                      value={this.editedCard.question}
                    />
                  )}
                </label>
                </div>
                <div id="div-reponse" className="div-label-form">
                <label className="label-large">
                <div>Réponse :</div>
                  {this.state.addingACard && (
                    <textarea
                      type="text"
                      autoFocus
                      className="ml-4 textarea-large"
                      id="inputreponse"
                    />
                  )}
                  {this.state.editingACard && (
                    <textarea
                      onChange={e => this.handleChangeCard(e, this.editedCard)}
                      type="text"
                      autoFocus
                      className="ml-4 textarea-large"
                      id="inputreponse"
                      value={this.editedCard.reponse}
                    />
                  )}
                </label>
                </div>
                <button type="submit" className="btn btn-default btn-danger button-normal-size" >
                  Envoyer
                </button>
              </form>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={e => this.handleCloseForm()}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else return "";
  };
  handleChangeCard = (event, card) => {
    console.log("Dans handleChangeCard");
    event.preventDefault();

    let state = { ...this.state };

    // Récupération des champs modifiés via le formulaire
    let question = document.getElementById("inputquestion").value;
    let reponse = document.getElementById("inputreponse").value;

    // récupération de l'index des colonnes
    let index_columns = state.colonnes.indexOf(this.editedColumn);
    // récupération de l'index des cartes
    let index_cards = state.colonnes[index_columns].cartes.indexOf(card);

    state.colonnes[index_columns].cartes[index_cards].question = question;
    state.colonnes[index_columns].cartes[index_cards].reponse = reponse;
    this.setState(state);
  };
  handleSubmit = event => {
    console.log("Le formulaire a été soumis : ");
    const login = document.getElementById("edit-name");
    const pwd = document.getElementById("edit-pass");
    console.log("login : " + login.value);
    //console.log("mdp : " + pwd.value);
    // Appel de la méthode pour récupérer le token
    this.state.coopernet.createReqToken(
      login.value,
      pwd.value,
      this.successLog,
      this.failedLog
    );
    event.preventDefault();
  };
  dumpFormLogin = () => {
    console.log("Dans formLogin");
    if (!this.state.userIsLogged) {
      return (
        <form id="login-form" onSubmit={this.handleSubmit}>
          <label className="mr-4 label-login-form">
            <div>login :</div>
            <input
              id="edit-name"
              name="name"
              type="text"
              className="validate ml-2"
            />
          </label>
          <label className="mr-4 label-login-form">
          <div>mot de passe :</div>
            <input
              id="edit-pass"
              name="pass"
              type="password"
              className="validate ml-2"
            />
          </label>
          <button type="submit" className="btn btn-default btn-info">
            Sign in
          </button>
        </form>
      );
    } else return "";
  };

  dumpTerms = () => {
    if (this.state.terms.length) {
      return (
        <section id="section-terms">
          {this.state.terms.map(term => {
            return (
                <Term
                  key={term.id}
                  id={term.id}
                  label={term.name}
                  onClick={this.state.coopernet.createReqCards}
                  onSuccess={this.successCards}
                  onFailed={this.failedCards}
                  selected={term.selected}
                />
            );
          })}
        </section>
      );
    }
  };
  changeStateEditingACard = (e, card, column) => {
    console.log("dans' changeStateEditingACard : ", card, column);
    const state = { ...this.state };
    state.editingACard = true;
    this.editedCard = card;
    this.editedColumn = column;
    this.setState(state);
  };
  changeStateAddingACard = numCol => {
    console.log("dans' changeStateAddingACard");
    console.log("Numéro de colonne dans laquelle ajouter la carte : " + numCol);
    this.numCol = numCol;
    const state = { ...this.state };
    state.addingACard = true;
    this.setState(state);
  };
  dumpColumn = () => {
    if (this.state.colonnes.length) {
      return (
        <section className="row section-cards">
          {this.state.colonnes.map(col => {
            return (
              <Colonne
                key={col.id}
                id={col.id}
                colonne={col}
                label={col.name}
                cards={col.cartes}
                onClickAddCard={this.changeStateAddingACard}
                onClickEditCard={this.changeStateEditingACard}
                onMoveCard={this.moveCard}
                onShowReponse={this.changeStateReponse}
                onRemove={this.state.coopernet.removeCard}
                user={this.state.coopernet.user}
                successRemoveCard={this.successRemoveCard}
                failedRemoveCard={this.failedRemoveCard}
              />
            );
          })}
        </section>
      );
    }
  };
  dumpHeader = () => {
    let title_user = "";
    if (this.state.userIsLogged) {
      title_user =
        "Utilisateur " +
        this.state.coopernet.user.uname +
        " connecté sur " +
        this.state.coopernet.url_serveur;
    }
    return (
      <header className="bg-secondary" id="main-header">
        <h1 id="title-memo" className="text-light">
          <GiBrainTentacle className="icon-logo" />e<span id="m-memo">M</span>o
        </h1>
        {this.state.userIsLogged && (
          <FaUserCheck
            id="icon-user"
            title={title_user}
            className="text-success"
          />
        )}
        {!this.state.userIsLogged && (
          <FaUserTimes
            id="icon-user"
            title="Utilisateur non connecté"
            className="text-light"
          />
        )}
      </header>
    );
  };
  changeStateReponse = (e, card, column) => {
    console.log("dans changeStateReponse");
    console.log("Theme : " + this.themeId);
    console.log("card : " + card);
    console.log("column : " + column.id);
    // il faut maintenant changer le state de la carte en question en
    // retrouvant l'index de la colonne en fct de l'id de la colonne
    // puis l'index de la carte en fct de l'id de la carte
    let state = { ...this.state };
    let colonne_index = state.colonnes.indexOf(column);
    console.log("Index de la colonne : " + colonne_index);
    let carte_index = state.colonnes[colonne_index].cartes.indexOf(card);
    console.log("Index de la carte : " + carte_index);
    state.colonnes[colonne_index].cartes[carte_index].show_reponse = state
      .colonnes[colonne_index].cartes[carte_index].show_reponse
      ? false
      : true;

    this.setState(state);
  };
  render() {
    return (
      <div>
        {this.dumpHeader()}

        <div className="container">
          {this.dumpFormLogin()}
          {this.state.msgError && (
            <div className="alert alert-warning">{this.state.msgError}</div>
          )}
          {this.dumpFormAddOrEditCard()}
          {this.dumpTerms()}
          {this.dumpColumn()}
        </div>
      </div>
    );
  }
}

export default Tableaux;
