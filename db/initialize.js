// server.js
// where your node app starts

// init project
var express = require('express');
var Sequelize = require('sequelize');
var app = express();




// setup a new database
// using database credentials set in .env
var sequelize = new Sequelize('AllCoinZ', process.env.DB_USER, process.env.DB_PASS, {
  host: '0.0.0.0',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000 
  },
    // Security note: the database is saved to the file `database.sqlite` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
  storage: 'data/AllCoinZ.sqlite'
});

// authenticate with the database
sequelize
  .authenticate()
  .then(() => { 
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  }); 



const User = sequelize.define('user', {
  displayName: {
    type: Sequelize.STRING
  },
  uniqID: {
    type: Sequelize.STRING
  },
  curr: {
    type: Sequelize.STRING
  }
});


User.sync();


// User.destroy({
//     where: {
//         // criteria
//     }
// })


//methods
var getRecords = function (model) {
  
  return model.findAll();
};

var getRecord = function (model,where) {
  return model.find({
      where: where
  });
};

var createRecord = function (model,item) {
      model.create(item).then(function(error){
       
  
  },function(error){
      
  });
};

var updateInsert = function (model, where, newItem) {
return model.findOne({
      where: where
  }).then(function (item) {
        
      if (!item) {
       console.log("Item Not Found");
        return model.create(newItem).then(function (item) {
              return {
                  item: item,
                  created: true
              }
          })
      } else {
        console.log("Item Found");
          return model.update(newItem, {
              where: where
          }).then(function (item) {
              return {
                  item: item,
                  created: false
              }

          })
      }
  })
}

module.exports = {
  g_User:User,
  g_getRecord:getRecord,
  g_getRecords:getRecords,
  g_createRecord:createRecord,
  g_UpdateInsert:updateInsert,
}
