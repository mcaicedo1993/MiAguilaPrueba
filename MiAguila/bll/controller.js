var express = require('express');
var fs = require('fs');
var mongo = require('mongodb');

var bll = {};
var MongoClient = null;
var mongoCollection = null;

bll.methods = {
    connectMongo: function () {
        MongoClient = mongo.MongoClient;
        MongoClient.connect("mongodb://admin:12345678aw-@cluster-test-shard-00-00-00s89.mongodb.net:27017,cluster-test-shard-00-01-00s89.mongodb.net:27017,cluster-test-shard-00-02-00s89.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-test-shard-0&authSource=admin&retryWrites=true", function (err, database) {
            if (err) {
                console.log("We have problems");
            }
            else {
                console.log("We are connected :)");
                const db = database.db('test');

                mongoCollection = db.collection('trips(1)');
            }
        });
    },
    getTrips: function (res, city_name = 'Bogotá', status = 'started') {
        if (mongoCollection) {
            try {
                var conditionName = { '$match': { 'city.name': city_name, 'status': status}};
                var projection = { '$project': { start: '$start.pickup_location.coordinates', end: '$end.pickup_location.coordinates', passenger_fisrt_name: '$passenger.first_name', passenger_last_name: '$passenger.last_name', status: '$status' } };
                mongoCollection.aggregate([conditionName, projection]).toArray(function (err, result) {
                    if (err) {
                        console.log('uuuu');
                        res.json({ 'status': 'error' });
                    }
                    else {
                        res.json({ 'status': 'ok', 'data': result });
                    }
                });
            }
            catch (ex) {
                console.log('eee');
            }
        }
    }
}

module.exports = bll;