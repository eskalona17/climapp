const data           = require('../data/aemet-locations.json');
const weatherService = require('../services/weather.service');
const passport       = require('passport');
const User           = require('../models/user.model');
const Places         = require('../models/places.model');
// const mongoose       = require('mongoose');
const Clime          = require('../models/clime.model')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports.search = (req, res, next) => {
    res.json(data);
  }

//   var p1 = Promise.resolve(3);
// var p2 = 1337;
// var p3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, "foo");
// }); 

// Promise.all([p1, p2, p3]).then(values => { 
//   console.log(values); // [3, 1337, "foo"] 
// });

  module.exports.oneSearch = (req, res, next) => {
    const location = req.user.location
    weatherService.getWeather(location, false)
      .then(weather => {
        console.log(weather)
        console.log(location)
        res.render('search', {weather, location})
      })
      .catch(next)
  }

  module.exports.CompleteSearch = (req, res, next) => {
    // const location = 28001
    const request = req.body;
    const day = req.body.day;
    const rain = req.body.rainSearch;
    console.log(request);
    let results = []
    const locations = Object.values(data)
      
    const placesByWeather = locations.map(location => {
      // return weatherService.getWeather(location, false)
      //   .then(weather => {
          // TODO: do something with this weather, maybe find db places by location and activities by waether?
          return Clime.find({ locationCode: location})
          .then(weather => {
            weather.map(prevision => {
              return res.json(prevision)
              // return prevision.map(previsionDay => {
              //   if (previsionDay.day = day) {
              //     return console.log('PREVISION: ' + previsionDay.rain)
              //   }
              // })
            })
            // res.json(weather[0].prevision[0].rain)
            // return Clime.find({ locationCode: location})
            // .then(places => {
              // console.log('lugares: ' + places)
              // return places.map(place => Object.assign(place, { weather }))
            }
            )
        })
    // })

  
    Promise.all(placesByWeather)
      .then(placesPromisesResponses => {
        let places = [];
        placesPromisesResponses.forEach(placesByWeather => {
          console.log(placesByWeather)
          places = [...places, ...placesByWeather]
        })
        res.json({ places })
      })
      .catch(next)
  
   }          