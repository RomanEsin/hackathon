firebase.initializeApp({
  apiKey: 'AIzaSyBczIxKNubEghukyYg-iwr5a0jqTbQqlRM',
  authDomain: 'https://empty-l33t.web.app',
  projectId: 'empty-l33t'
});

var db = firebase.firestore();
var currentUserData = {};

function setup() {
  // console.log(firebase);
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // console.log(user);
      // console.log(firebase.auth().currentUser)

      getUserFromCollection(user).then(userData => {
        currentUserData = userData;
        updateUserPage();
      })


      // window.location = 'account.html';
    } else {currentUserData
      console.log('no account');
    }
  });
}

setup();

function updateUserPage() {
  if (window.location.pathname.endsWith("account.html")) {
    let username = document.getElementById("username")
    let id = document.getElementById("userId")
    let check = document.getElementById("courierBox");
    let checkText = document.getElementById("courierText");

    var user = firebase.auth().currentUser;

    username.innerHTML = user.email;
    id.innerHTML = user.uid;

    check.checked = currentUserData.permissions > 0

    username.style.display = "block";
    id.style.display = "block";
    check.style.display = "block";
    checkText.style.display = "block";

    // if (!user) {
      // window.location = 'account.html';
    // }
  }
}

function courierDidChange() {
  var check = document.getElementById("courierBox").checked ? 1 : 0;

  setUserPermissions(firebase.auth().currentUser, check).then(() => {
    console.log('Success changing perms');
  }).catch(error => {
    console.log(error);
  });
}

function getUserFromCollection(user) {
  return new Promise((resolve, reject) => {
    db.collection("users").doc(user.uid).get().then(doc => {
      resolve(doc.data())
    }).catch(error => {
      reject(error)
    })
  })
}

function addItemToItemOrder(item) {
  let itemOrder = db.collection("itemOrders").doc(firebase.auth().currentUser.uid)

  return new Promise((resolve, reject) => {
    itemOrder.get().then(doc => {
      var initArray = {items: []};

      if (doc.data().items) {
        initArray.items = doc.data().items;
      }

      initArray.items.push(item)

      itemOrder.set(initArray).then(() => {
        resolve('Success');
      }).catch(error => {
        reject(error);
      })
    }).catch(error => {
      reject(error);
    })
  })
}

// На этой строке мы получили визитку щаместителя проректора
// 3 Октября 2020 года 22:54
function setUserPermissions(user, perms) {
  return new Promise((resolve, reject) => {
    db.collection("users").doc(user.uid).set({ permissions: perms }, { merge: true }).then(() => {
      resolve();
    }).catch(error => {
      reject(error);
    })
  })
}

function getAccount() {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // console.log(user);
      // console.log(firebase.auth().currentUser)
      resolve(user);
      // window.location = 'account.html';
    } else {
      console.log('no account');
      reject("NOT LOGGED IN");
    }
  });
  })
}

function createUserData(user) {
  let id = user.uid;
  console.log(user.uid);

  return new Promise((resolve, reject) => {
    db.collection("users").doc(id).set({
      name: user.email,
      permission: 0
    }).then(() => {
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

function createAccount() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
      createUserData(firebase.auth().currentUser).then(() => {
        console.log("Did create user");
        window.location = 'account.html';
      })
    }).catch(error => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode, errorMessage);
      // ...
    });
  }).catch(error => {
    console.log(error);
  })
}

function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  console.log('asdfdsaf');

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
    console.log('lkshjcfdaoi');
    return firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      window.location = 'account.html';
      console.log("pijasdbfiadsnfpasdbn");
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log(errorCode, errorMessage);
      // ...
    });
  }).catch(error => {
    console.log(error);
  });
}

function logout() {
  firebase.auth().signOut().then(() => {
    console.log('Did sign out');
    window.location = 'index.html';
  }).catch(error => {
    console.log(error);
  })
}

function myFunction() {
  // shops.get().then(snapshot => {
    // snapshot.forEach(doc => {
      // console.log(doc.id);
      // doc.data().allShops.forEach(data => {
      //   if (data) {
      //     let doc = items.doc(data.id);
      //     doc.get({source: "server"}).then(doc => {
      //       // Item for shop
      //       console.log(doc.data());
      //     }).catch(error => {
      //       console.log(error);
      //     });
      //   }
      // });
    // })
  // })

  // Get items in shop
  // getItemsIn("3HUvjvozXFhXa3glp7uQ").then(items => {
  //   console.log(items);
  // }).catch(error => {
  //   console.log(error);
  // });

  // createShop({
  //   name: "CHLENO-SHOP",
  //   ownerId: "asdfasdfas",
  //   itemsAddress: "https://dns.ru",
  //   categories: ["grocery", "sec toys", "other"]
  // }).then(doc => {
  //   console.log('Created doc');
  //   console.log(doc.id);

  //   addItemsToShop(doc.id, [{
  //     localId: "weiuqiodifj",
  //     name: "chainik",
  //     description: "this is a description",
  //     price: 100,
  //     sale: 0,
  //     images: [],
  //     category: "grocery"
  //   },
  //   {
  //     localId: "bgrwewert",
  //     name: "fdsa",
  //     description: "this is a description",
  //     price: 100,
  //     sale: 0,
  //     images: [],
  //     category: "sex"
  //   },
  //   {
  //     localId: "ae5543",
  //     name: "vdsa",
  //     description: "this is a description",
  //     price: 100,
  //     sale: 0,
  //     images: [],
  //     category: "dvfu"
  //   },
  //   {
  //     localId: "grew",
  //     name: "we32",
  //     description: "this is a description",
  //     price: 100,
  //     sale: 0,
  //     images: [],
  //     category: "hahathon"
  //   }])
  // }).then(() => {
  //   console.log('Created items');
  // }).catch(error => {
  //   console.log(error);
  // })

  // getItemsDocsByCategory("dvfu").then(itemDocs => {
  //   console.log(itemDocs.docs);
  // });

  createOrder("asdfasd").then(result => {
    console.log(result.order);
  })
};

function createOrder(userId, items) {
  var activeOrders = db.collection("activeOrders")

  return new Promise((resolve, reject) => {
    let order = {
      courierId: "",
      creationTime: new firebase.firestore.Timestamp(1601596810, 0),
      customers: [userId],
      deliveryAddress: "",
      state: 0,
      items: [],
      recieveTime: 0
    };

    activeOrders.add(order).then(doc => {
      resolve({ order: order, id: doc.id })
    }).catch(error => {
      reject(error);
    })
  })
}

function addItemToOrder(item, order) {
  var itemObject = typeof item == 'string' ? JSON.parse(item) : item;

  db.collection("activeOrders").doc()
}

function getAllItems() {
  var shops = db.collection("shops")

  return new Promise((resolve, reject) => {
    shops.get().then(snapshot => {
      var array = []
      snapshot.docs.forEach(doc => {
        let toPush = db.collection("shops").doc(doc.id).collection("items").get()
        array.push(toPush)
      })

      var allItems = []

      Promise.all(array).then(items => {
        var array = []
        items.forEach(doc => {
          doc.docs.forEach(itemDoc => {
            array.push(itemDoc.data())
          })
        })

        Promise.all(array).then(docs => {
          resolve(docs);
        }).catch(error => {
          reject(error);
        })
      }).catch(error => {
        console.log(error);
        reject(error);
      })
    })
  });;
}

function getItemsIn(shopId) {
  var shops = db.collection("shops").doc(shopId);

  return new Promise((resolve, reject) => {
    shops.collection("items").get().then(snapshot => {
      resolve(snapshot.docs.map(doc => { return {id: doc.id, itemData: doc.data()} }));
    }).catch(error => {
      reject(error);
    })
  });;
}

function createShop(shopData) {
  var shops = db.collection("shops")

  return new Promise((resolve, reject) => {
    shops.add(shopData).then(doc => {
      resolve(doc)
    }).catch(error => {
      reject(error);
    });
  });
}

function addItemsToShop(shopId, items) {
  var itemsCollection = db.collection("shops").doc(shopId).collection("items");

  return new Promise((resolve, reject) => {
    let batch = db.batch()
    items.forEach(item => {
      let doc = itemsCollection.doc()
      doc.set(item);
    })

    batch.commit().then(() => {
      resolve();
    }).catch(error => {
      reject(error);
    });
  });
}