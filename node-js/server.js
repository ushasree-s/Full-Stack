const express = require("express");
const app = express();

app.use(express.static("public"));
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");


initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://your-firebase-project-id.firebaseio.com", 
});


const db = getFirestore();

app.get("/signup", function (req, res) {
  res.sendFile(__dirname + "/public/" + "signup.html");
});

app.get("/signupSubmit", function (req, res) {
  db.collection("signup")
    .add({
      Fullname: req.query.Fullname,
      Email: req.query.Email,
      Password: req.query.Password,
    })
    .then(() => {
      res.send("Signup Successful, please login");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      res.status(500).send("Signup failed");
    });
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/" + "login.html");
});

app.get("/loginSubmit", function(req, res){
  db.collection("signup")
  .where("Email", "==", req.query.Email)
    .where("Password", "==",req.query.Password)
      .get()
        .then((docs) => {
          if(docs.size>0){
            res.redirect("photo.html");
          }
          else{
            res.redirect("/login?loginFailed=true");
          }
        })
});

app.get("/dashboard", function (req, res) {
  res.send("Hi");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});