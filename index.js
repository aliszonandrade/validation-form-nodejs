var express = require("express");
var app = express();
var session = require('express-session');
var flash = require('express-flash');
var bodyParser  = require('body-parser');
var cookieParser = require("cookie-parser");

const res = require("express/lib/response");
app.set('view engine','ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser("maoe"));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }))

app.use(flash());

app.get("/", (req, res) => {

    var emailError = req.flash("emailError");
    var pontosError = req.flash("pontosError");
    var nomeError = req.flash("nomeError"); 
    var email = req.flash("email");
    var nome = req.flash("nome");
    var pontos = req.flash("pontos");

    emailError = emailError == undefined || emailError.lenght == 0 ? undefined : emailError;
    pontosError = pontosError == undefined || pontosError.lenght == 0 ? undefined : pontosError;
    nomeError = nomeError == undefined || nomeError.lenght == 0 ? undefined : nomeError;
    email = email == undefined || email.lenght < 1 ? "" : email;
    nome = nome == undefined ? "" : nome;
    pontos = pontos == undefined ? 0 : pontos;

    res.render("index",{emailError,pontosError,nomeError,email,nome,pontos});
})

app.post("/form", (req, res) => {
    var {email, nome, pontos} = req.body;

    var emailError;
    var pontosError;
    var nomeError;    

    if(email == undefined || email == "" || email.lenght < 6){
        emailError = "E-mail inválido";
    }
    if(nome == undefined || nome == "" || nome.lenght < 3){
        nomeError = "Nome inválido";
    }
    if(pontos == undefined || pontos < 1){
        pontosError = "Pontos inválido";
    }

    if(emailError != undefined || nomeError != undefined || pontosError != undefined){
        req.flash("emailError",emailError);
        req.flash("nomeError",nomeError);
        req.flash("pontosError",pontosError);
        req.flash("email", email);
        req.flash("nome", nome);
        req.flash("pontos", pontos);

        res.redirect("/");
    }else{
        res.send("Tudo certo! Mas não vou fazer nada com isso.")
    }
})

app.listen(8080, (req, res) => {
    console.log("Servidor rodando!");
});