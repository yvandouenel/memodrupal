import React, { Component } from "react";
import Coopernet from "./Coopernet";
import Term from "./Term";

class Tableaux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coopernet: new Coopernet(),
      userIsLogged: false,
      msgError: "",
      terms: []
    };

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
    console.log("Dans succesLog");
    const state = { ...this.state };
    console.log("user : ",this.state.coopernet.user.uid,this.state.coopernet.user.uname,this.state.coopernet.user.upwd);
    state.userIsLogged = true;
    state.msgError = "";
    this.setState(state);
    // création de la requête pour obtenir les thématiques
    this.state.coopernet.createReqTerms(this.succesTerms, this.failedTerms);
  };
  succesTerms = (terms) => {
    console.log("Dans succesTerms");
    const state = { ...this.state };
    state.terms = terms;
    this.setState(state);
  };
  failedTerms = () => {
    console.log("Dans failedTerms");
  };
  failedLog = (msg = "") => {
    console.log("Dans failedLog");
    const state = { ...this.state };
    state.userIsLogged = false;
    if (msg) state.msgError = msg;
    this.setState(state);
  };
  handleSubmit = event => {
    console.log("Le formulaire a été soumis : ");
    const login = document.getElementById("edit-name");
    const pwd = document.getElementById("edit-pass");
    console.log("login : " + login.value);
    console.log("mdp : " + pwd.value);
    // Appel de la méthode pour récupérer le token
    this.state.coopernet.createReqToken(login.value,pwd.value,this.successLog,this.failedLog);
    event.preventDefault();
  };
  dumpFormLogin = () => {
    console.log("Dans formLogin");
    if (!this.state.userIsLogged) {
      return (
        <form id="login" onSubmit={this.handleSubmit}>
          <label>
            login :
            <input
              id="edit-name"
              name="name"
              type="text"
              className="validate"
            />
          </label>
          <label>
            mot de passe :
            <input
              id="edit-pass"
              name="pass"
              type="password"
              className="validate"
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
    if(this.state.terms.length) {
      return (
        this.state.terms.map((term) => {
          return <Term key={term.id} id={term.id} label={term.name} />
        })
      );
    }
  }
  render() {
    return (
      <div className="container">
        <h1>Memo</h1>
        {this.state.userIsLogged && (
          <div className="buttons-tableaux">
            <h3>Utilisateur {this.state.coopernet.user.uname} connecté sur {this.state.coopernet.url_serveur}</h3>
          </div>
        )}
        {this.dumpFormLogin()}
        {this.state.msgError && (
          <div className="alert alert-warning">{this.state.msgError}</div>
        )}
        {this.dumpTerms()}
      </div>
    );
  }
}

export default Tableaux;
