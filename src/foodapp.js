var config = {
  apiKey: apiToken,
  authDomain: "localhackday-food.firebaseapp.com",
  databaseURL: "https://localhackday-food.firebaseio.com/",
  messagingSenderId: "237865884821",
};
firebase.initializeApp(config);

firebase.database().ref('/test').on('value', function(snapshot) {
  console.log(snapshot);
});