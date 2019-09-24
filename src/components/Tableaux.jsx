import React, { Component } from "react";
import Coopernet from "./Coopernet";
class Tableaux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coopernet: new Coopernet(),
      userIsLogged: false
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
    state.userIsLogged = true;
    this.setState(state);
  };
  failedLog = () => {
    console.log("Dans failedLog");
    const state = { ...this.state };
    state.userIsLogged = false;
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
  formLogin = () => {
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
  render() {
    return (
      <div className="container">
        <h1>Memo</h1>
        {this.state.userIsLogged && (
          <div className="buttons-tableaux">
            <h3>Utilisateur connecté</h3>
          </div>
        )}
        {this.formLogin()}
      </div>
    );
  }
}

export default Tableaux;
