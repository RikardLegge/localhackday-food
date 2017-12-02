var config = {
  apiKey: apiToken,
  authDomain: "localhackday-food.firebaseapp.com",
  databaseURL: "https://localhackday-food.firebaseio.com/",
  messagingSenderId: "237865884821",
};
firebase.initializeApp(config);

firebase.database().ref('/fridge').on('value', function(snapshot) {
  console.log(snapshot.val());
});

// let defaultOptions = {
//   url:'',
//   method:'POST',
//   mode: 'cors',
  // headers: new Headers({
  //   'Access-Control-Allow-Origin':'*'
  // }),
  // body:"needsimage=1&kitchen=butter%2Cbanana%2Ccinnamon%2Capple&focus=&kw=&catname=Dinner%2C&exclude=&start=0",
// };
//
// fetch("http://www.supercook.com/dyn/results", defaultOptions);