import React, { Component } from "react";
import Coopernet from "./Coopernet";
import Term from "./Term";
import Colonne from "./Colonne";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Tableaux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coopernet: new Coopernet(),
      userIsLogged: false,
      addingACard: false,
      msgError: "",
      terms: [],
      colonnes: []
    };
    this.dumpModal = true;
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
      this.state.coopernet.user.upwd
    );
    state.userIsLogged = true;
    state.msgError = "";
    this.setState(state);
    // création de la requête pour obtenir les thématiques
    this.state.coopernet.createReqTerms(this.successTerms, this.failedTerms);
  };
  successAddCard = msg => {
    console.log("Dans successAddCard");
  };
  failedAddCard = () => {
    console.log("Dans failedAddCard");
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
  successCards = (cols) => {
    console.log("Dans successCards");
    cols.sort((a,b) => a.id - b.id );
    console.log("Colonnes : ", cols);
    const state = { ...this.state };
    state.colonnes = cols;
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
  handleSubmitAddCard = event => {
    console.log("dans handleSubmitAddCard");

    event.preventDefault();
  };
  handleCloseForm = event => {
    console.log("dans handleCloseForm");
    const state = { ...this.state };
    state.addingACard = false;
    this.setState(state);
  };
  dumpFormAddCard = () => {
    console.log("Dans dumpFormAddCard");
    if (this.state.addingACard) {
      console.log("addingACard = yes");
      return (
        <Modal
            show={this.dumpModal}
            size="lg"
            className="modal-large"
          >
            <Modal.Header >
              <Modal.Title>Modifier une question et/ou une réponse</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {
                /* formulaire ici */
                <form onSubmit={(e) => {this.props.onSubmitQR(e)}}>
                  <label className="label-large">
                    question:
                    <input
                      type="text"
                      autoFocus
                      className="ml-4 input-large"
                      value={this.props.question}

                    />
                  </label>
                  <label className="label-large">
                    Réponse:
                    <textarea
                      type="text"
                      autoFocus
                      className="ml-4 textarea-large"
                      value={this.props.reponse}

                    />
                  </label>

                </form>
              }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={e =>
                        this.handleCloseForm()
                      }>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>

      );
    } else return "";
  }
  handleSubmit = event => {
    console.log("Le formulaire a été soumis : ");
    const login = document.getElementById("edit-name");
    const pwd = document.getElementById("edit-pass");
    console.log("login : " + login.value);
    console.log("mdp : " + pwd.value);
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
        <form id="add_card" onSubmit={this.handleSubmit}>
          <label className="mr-4">
            login :
            <input
              id="edit-name"
              name="name"
              type="text"
              className="validate ml-2"
            />
          </label>
          <label className="mr-4">
            mot de passe :
            <input
              id="edit-pass"
              name="pass"
              type="password"
              className="validate ml-2"
            />
          </label>
          <button type="submit" className="btn btn-default btn-submit">
            Sign in
          </button>
        </form>
      );
    } else return "";
  };

  dumpTerms = () => {
    if (this.state.terms.length) {
      return this.state.terms.map(term => {
        return (
          <Term
            key={term.id}
            id={term.id}
            label={term.name}
            onClick={this.state.coopernet.createReqCards}
            onSuccess={this.successCards}
            onFailed={this.failedCards}
          />
        );
      });
    }
  };
  changeStateAddingACard = () => {
    console.log("dans changeStateAddingACard");
    const state = {...this.state};
    state.addingACard = true;
    this.setState(state);
  }
  dumpColumn = () => {
    if (this.state.colonnes.length) {
      return (
        <div className="row">
        {this.state.colonnes.map(col => {
        return (
          <Colonne
            key={col.id}
            id={col.id}
            label={col.name}
            cards={col.cartes}
            onClickAddCard={this.changeStateAddingACard}
            /* login={this.state.coopernet.user.uname}
            pwd={this.state.coopernet.user.upwd}
            onSuccess={this.successAddCard}
            onFailed={this.failedAddCard} */
          />
        );
      })}</div>);
    }
  };
  render() {
    return (
      <div className="container">
        <h1>Memo</h1>
        {this.state.userIsLogged && (
          <div className="buttons-tableaux">
            <h3>
              Utilisateur {this.state.coopernet.user.uname} connecté sur{" "}
              {this.state.coopernet.url_serveur}
            </h3>
          </div>
        )}
        {this.dumpFormLogin()}
        {this.state.msgError && (
          <div className="alert alert-warning">{this.state.msgError}</div>
        )}
        {this.dumpFormAddCard()}
        {this.dumpTerms()}
        {this.dumpColumn()}
      </div>
    );
  }
}

export default Tableaux;
