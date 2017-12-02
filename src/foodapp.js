var config = {
  apiKey: apiToken,
  authDomain: "localhackday-food.firebaseapp.com",
  databaseURL: "https://localhackday-food.firebaseio.com/",
  messagingSenderId: "237865884821",
};
firebase.initializeApp(config);

const fridgeDb = firebase.database();
const fridgeRef = fridgeDb.ref('/fridge');
const now = new Date("2017-12-1");
updateUiWhenDbChanges(document.querySelector(".list"));

{
  const nameText = document.querySelector(".addIngredientName");
  const dateText = document.querySelector(".addIngredientDate");
  nameText.onkeydown  = onDown;
  dateText.onkeydown  = onDown;

  function onDown(event) {
    if (event.keyCode == 13) {
      const name = nameText.value;
      const date = dateText.value;
      addIngredient(name, date);

      nameText.value = "";
      dateText.value = "";
    }
  }
}

function addIngredient(name, expires) {
  const ingredientRef = fridgeDb.ref(`/fridge/${name}`);
  ingredientRef.set({expiresOn: expires});
}

function removeIngredient(name) {
  fridgeDb.ref(`/fridge/${name}`).remove();
}

function updateUiWhenDbChanges(list){
  fridgeRef.on('value', function(snapshot) {
    const val = snapshot.val();

    let html = "";
    Object.keys(val).forEach(name => {
      const expiration = val[name].expiresOn;
      html += `
          <li>
            <div>${name} expires on ${expiration}</div>
            <button class="btn btn-default" data-id="${name}">Remove</button>
          </li>`;
    });

    list.innerHTML = html;
    list.onclick = function(e) {
      const name = e.target.dataset.id;
      removeIngredient(name);
    }

  })
}

function generateRecipiesFromIngredients(daysOld) {
  return new Promise((resolve) => {
    fridgeRef.once('value').then(async function(snapshot) {
      const val = snapshot.val();
      let ingredients = Object.keys(val).filter(key => lessThan(val[key].expiresOn, daysOld));
      if(ingredients.length  === 0) {
        ingredients = Object.keys(val);
      }

      console.log("Using ingredients", ingredients);
      const result = await getRecipies(ingredients);
      result.json().then(function(recipies) {
        resolve(recipies);
      });
    });
  });
}

function lessThan(dateString, days) {
  const date = new Date(dateString);
  // Allow negative times
  const timeDiff = date.getTime() - now.getTime();
  return timeDiff < 1000*3600*24*days;
}

function getRecipies(include) {
  const exclude = [];
  const excludeStr = exclude.join(',');
  const includeStr = include.join(',');

  return fetch("http://www.supercook.com/dyn/results", {
    method:'POST',
    body:`needsimage=0&kitchen=${includeStr}&focus=&kw=&catname=Dinner&exclude=${excludeStr}&start=0`,
  });
}
