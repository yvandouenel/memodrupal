import { Component } from "react";

class Coopernet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.url_serveur = "http://local.d8-json.my/";
  }
  token = () => {
    // création de la requête
    console.log("Dans token de coopernet");
    const req_token = new XMLHttpRequest();
    req_token.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.getToken(req_token);
    };
    // Fait appel au "end-point créé dans le module drupal memo"
    req_token.open("GET", this.url_serveur + "rest/session/token/", true);
    req_token.send(null);
  };
  getToken = req => {
    console.log("Dans geToken de coopernet");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu de la réponse
      console.log("token : ", req.responseText);
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb getToken - Statut : ", req.status, req.statusText);
    }
  };

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
