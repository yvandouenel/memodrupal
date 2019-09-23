import { Component } from "react";

class Coopernet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.url_serveur = "http://local.d8-json.my/";
    this.token = "";
  }
  createReqToken = (login,pwd) => {
    // création de la requête
    console.log("Dans token de coopernet");
    const req_token = new XMLHttpRequest();
    req_token.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.getToken(req_token,this.tokenSuccess,login,pwd);
    };
    // Fait appel au "end-point créé dans le module drupal memo"
    req_token.open("GET", this.url_serveur + "rest/session/token/", true);
    req_token.send(null);
  };
  getToken = (req,sucess,login,pwd) => {
    console.log("Dans getToken de coopernet");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu du token
      console.log("token : ", req.responseText);
      this.token = req.responseText
      sucess(login,pwd);
      return req.responseText;
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb getToken - Statut : ", req.status, req.statusText);
      return "";
    }
  };
  tokenSuccess = (login,pwd) => {
    console.log("dans tokenSuccess");
    console.log(login,pwd,this.token);
    const req_user_login = new XMLHttpRequest();
    req_user_login.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.postLogin(req_user_login);
    };
    // Fait appel au "end-point" de login
    console.log("post login method : ",this.url_serveur + "/user/login?_format=json");
    req_user_login.open("POST", this.url_serveur + "/user/login?_format=json", true);
    req_user_login.responseType = 'json';
    req_user_login.setRequestHeader('X-CSRF-Token', this.token);
    req_user_login.send("name=" + login + "&pass=" + pwd);
  }
  postLogin = (req) => {
    console.log("dans postLogin");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu de la réponse
      console.log("login response : ", req.responseText);
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb login - Statut : ", req.status, req.statusText);
      return "";
    }
  }
  isLogged = (callbackSuccess, callbackFailed) => {
    console.log("Dans isLogged du component Coopernet");

    // création de la requête
    const req_logged = new XMLHttpRequest();
    req_logged.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.getIsLogged(req_logged, callbackSuccess, callbackFailed);
    };
    // Fait appel au "end-point créé dans le module drupal memo"
    req_logged.open("GET", this.url_serveur + "memo/is_logged", true);
    req_logged.send(null);
  };
  getIsLogged = (req, callbackSuccess, callbackFailed) => {
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu de la réponse
      console.log("Appel à /memo/is_logged ok");
      // Construction de l'objet js à partir des données récupérées avec
      // la fonction JSON.parse
      var jsonResponse = JSON.parse(req.responseText);
      if (jsonResponse.user === 0) {
        console.log("anonymous user");
        console.log("User", jsonResponse.user);
        callbackFailed();
      } else {
        console.log("User", jsonResponse.user);
        callbackSuccess();
      }
      //login(this.responseText);
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Statut actuel", req.status, req.statusText);
    }
  };

  render() {
    return null;
  }
}
export default Coopernet;
