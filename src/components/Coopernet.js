import { Component } from "react";

class Coopernet extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.url_serveur = "http://local.d8-json.my/";
    this.token = "";
    this.user = {
      uid: 0,
      uname: "",
      upwd: ""
    };
  }
  createReqAddCards = (login, pwd, question, reponse, themeid, columnid, callbackSuccess, callbackFailed) => {
    console.log("Dans createReqAddCards de coopernet");
    // création de la requête
    // utilisation de fetch
    fetch("http://local.d8-json.my/entity/node?_format=hal_json", {
    // permet d'accepter les cookies ?
    credentials: 'same-origin',
      method: "POST",
      headers: {
        "Content-Type": "application/hal+json",
        "X-CSRF-Token": this.token,
        "Authorization": "Basic " + btoa(login + ":" + pwd)
      },
      body: JSON.stringify({
        "_links": {
          "type": {
            "href":"http://local.d8-json.my/rest/type/node/carte"
          }
        },
        "title":[{
          "value": question
        }],
        "field_carte_question":[{
          "value": question
        }],
        "field_carte_reponse":[{
          "value": reponse
        }],
        "field_carte_colonne":[{
          "target_id": columnid,
          "url": "/taxonomy/term/" + columnid
        }],
        "field_carte_thematique":[{
          "target_id": themeid,
          "url": "/taxonomy/term/" + themeid
        }],
        "type":[{
          "target_id":"carte"
        }]
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log("data reçues le :", data.created[0].value);
        if (data.created[0].value) {
          callbackSuccess(themeid);
        } else {
          callbackFailed("Erreur de login ou de mot de passe");
        }
      });
  };

  createReqCards = (termNumber, callbackSuccess, callbackFailed) => {
    // création de la requête
    console.log("Dans createReqCards de coopernet");
    const req_cards = new XMLHttpRequest();
    req_cards.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.getCards(req_cards, termNumber, callbackSuccess, callbackFailed);
    };
    // Fait appel au "end-point créé dans le module drupal memo"
    // Pour régler le problème de cache, j'ai ajouté le paramètre "time" à la
    // requête get cf : https://drupal.stackexchange.com/questions/222467/drupal-8-caches-rest-api-calls/222482
    req_cards.open(
      "GET",
      this.url_serveur +
        "memo/list_cartes_term/" +
        this.user.uid +
        "/" +
        termNumber+
        "&time=" + Math.floor(Math.random() * 10000),
      true
    );
    req_cards.send(null);
  };
  getCards = (req, termNumber, callbackSuccess, callbackFailed) => {
    console.log("Dans getCards de coopernet");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu du token
      let jsonResponse = JSON.parse(req.responseText);
      // ajout de la propriété show_reponse à chaque carte
      console.log("Ajout prop carte");
      jsonResponse.forEach(function(element) {
        element.cartes.forEach(function(ele) {
          ele.show_reponse = false;
        });
      });
      callbackSuccess(jsonResponse, termNumber);
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb getCards - Statut : ", req.status, req.statusText);
    }
  };
  createReqTerms = (callbackSuccess, callbackFailed) => {
    // création de la requête
    console.log("Dans createReqTerms de coopernet");
    const req_terms = new XMLHttpRequest();
    req_terms.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.getTerms(req_terms, callbackSuccess, callbackFailed);
    };
    // Fait appel au "end-point créé dans le module drupal memo"
    req_terms.open("GET", this.url_serveur + "memo/themes/", true);
    req_terms.send(null);
  };
  getTerms = (req, callbackSuccess, callbackFailed) => {
    console.log("Dans getTerms de coopernet");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu du token
      console.log("terms : ", req.responseText);
      let jsonResponse = JSON.parse(req.responseText);
      callbackSuccess(jsonResponse);
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb getTerms - Statut : ", req.status, req.statusText);
    }
  };
  createReqToken = (login, pwd, callbackSuccess, callbackFailed) => {
    // création de la requête
    console.log("Dans createReqToken de coopernet");
    const req_token = new XMLHttpRequest();
    req_token.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.getToken(
        req_token,
        this.tokenSuccess,
        login,
        pwd,
        callbackSuccess,
        callbackFailed
      );
    };
    // Fait appel au "end-point créé dans le module drupal memo"
    req_token.open("GET", this.url_serveur + "rest/session/token/", true);
    req_token.send(null);
  };
  getToken = (req, sucess, login, pwd, callbackSuccess, callbackFailed) => {
    console.log("Dans getToken de coopernet");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu du token
      console.log("token : ", req.responseText);
      this.token = req.responseText;
      sucess(login, pwd, callbackSuccess, callbackFailed);
      return req.responseText;
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb getToken - Statut : ", req.status, req.statusText);
      return "";
    }
  };
  tokenSuccess = (login, pwd, callbackSuccess, callbackFailed) => {
    console.log("dans tokenSuccess de coopernet");
    console.log(login, pwd, this.token);
    // utilisation de fetch
    fetch("http://local.d8-json.my/user/login?_format=json", {
      credentials: 'same-origin',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.token
      },
      body: JSON.stringify({
        name: login,
        pass: pwd
      })
    })
      .then(response => response.json())
      .then(data => {
        //console.log("success", data);
        if (data.current_user === undefined) {
          console.log("Erreur de login");
          callbackFailed("Erreur de login ou de mot de passe");
        } else {
          console.log("user", data.current_user);
          this.user.uid = data.current_user.uid;
          this.user.uname = data.current_user.name;
          this.user.upwd = pwd;
          callbackSuccess();
        }
      });
    /**
     * Je ne suis pas arrivé à faire fonctionner la requête avec l'objet XMLHttpRequest
     * voir le code ci dessous
     */
    /* const req_user_login = new XMLHttpRequest();
    req_user_login.onload = () => {
      // passage de la requête en paramètre, sinon, c'est this (coopernet qui serait utilisé)
      this.postLogin(req_user_login);
    };
    // Fait appel au "end-point" de login
    console.log("post login method : ",this.url_serveur + "/user/login?_format=json");
    req_user_login.open("POST", this.url_serveur + "/user/login?_format=json", true);
    //req_user_login.responseType = 'json';
    req_user_login.setRequestHeader('X-CSRF-Token', this.token);
    req_user_login.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
    //req_user_login.send("name=" + login + "&pass=" + pwd);
    //req_user_login.send({ "data": {"name": "jose","pass": "jose"}});
    req_user_login.send(JSON.stringify({ "data": {"name": "jose","pass": "jose"}})); */
  };
  postLogin = req => {
    console.log("dans postLogin de coopernet");
    // On teste directement le status de notre instance de XMLHttpRequest
    if (req.status === 200) {
      // Tout baigne, voici le contenu de la réponse
      console.log("login response : ", req.responseText);
    } else {
      // On y est pas encore, voici le statut actuel
      console.log("Pb login - Statut : ", req.status, req.statusText);
      return "";
    }
  };

  isLogged = (callbackSuccess, callbackFailed) => {
    console.log("Dans isLogged de Coopernet");

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
    console.log("dans getIsLogged de coopernet");
    if (req.status === 200) {
      // Tout baigne, voici le contenu de la réponse
      console.log("Appel à /memo/is_logged ok");
      // Construction de l'objet js à partir des données récupérées avec
      // la fonction JSON.parse
      let jsonResponse = JSON.parse(req.responseText);
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
