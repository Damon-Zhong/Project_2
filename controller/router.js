const orm = require("../app/orm");
const express = require("express");
const City = require("../model/city");
const { response } = require("express");
const CityModel = new City();
require('dotenv').config();
var path = require("path");
var fs = require('fs');

function router( app ){
    // GET all cities
    app.get("/api/cities/list", async function( req, res ){
        const cities = await orm.getCityList();
        res.send(cities);
    })

    //[GET] city profile
    app.get("/cities/:id", async function( req, res ){
        const city_id = req.params.id
        const city_info = await orm.selectCityData(city_id)
        res.send( city_info )
    })

    // GET pretty urls
    app.get("/destinations/:name", async function( req, res ){
        const name = req.params.name;
        const city_id = await orm.getCityIdByName(name);
        res.sendFile(path.join(__dirname, '..', '/public/cities.html'));
    })

    //[GET] city profile picture from Pexel API
    app.get("/api/pic/:cityname", async function( req, res ){
        const city_name = req.params.cityname
        const result = await CityModel.getCityPic( city_name )
        res.send( result )
    })

    // GET search feature for cities
    app.get("/api/search", async function( req, res ){
        const city_query = req.query.q
        const result = await CityModel.searchCities( city_query )
        res.send( result )
    })

    //[GET] search by city name or click on city
    app.get("/api/weather/:cityname", async function( req, res ){
        const city_name = req.params.cityname
        const weather = await CityModel.getWeather( city_name )

        res.send( weather )
    })
 
    //[POST] submit city info
    app.post("/api/addcity", async function( req, res ){
        console.log(`[POST] data received:${req.body}`)
        await orm.insertCityData( req.body )
        res.redirect("/")
    })

    // [GET] render city content from database
    app.get("/api/data", async function(req, res){
        const cityId = req.query.id;
        const data = await CityModel.getCity(cityId);
        res.send(data);
    });
}

module.exports = router