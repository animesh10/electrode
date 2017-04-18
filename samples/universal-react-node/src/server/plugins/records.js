"use strict";
/*eslint-env es6*/
const plugin = {};
const fs = require("fs");
const path = require("path");
const HTTP_CREATED = 201;
const HTTP_ISE = 500;
const mongojs = require("mongojs");
const uuidV1 = require("uuid/v1");
const Joi = require("Joi");

plugin.register = function (server, options, next) {
  let db = mongojs('electrode-mongo', ['records']);

  //Get All Records
  server.route({
    method: "GET",
    path: "/records",
    handler: (request, reply) => {
      db.records.find((err, docs) => {
        if (err) {
          return reply('Internal MongoDB error', err);
        }
        reply(docs).status(200);
      });
    }
  });

  //Get 1 Record
  server.route({
    method: 'GET',
    path: '/records/{id}',
    handler: function (request, reply) {

      db.records.findOne({
        _id: request.params.id
      }, (err, doc) => {
        if (err) {
          return reply('Internal MongoDB error');
        }
        if (!doc) {
          return reply("No Record Found");
        }
        reply(doc);
      });
    }
  });

  //Add a record
  server.route({
    method: 'POST',
    path: '/addRecord',
    handler: function (request, reply) {
      console.log("CAME HERE", request.body);
      const record = request.payload;
      //Create an id
      record._id = uuidV1();

      db.records.save(record, (err, result) => {
        if (err) {
          console.log(err);
          return reply('Internal MongoDB error');
        }
        reply(record).code(201);
      });
    } /*
    config: {
      validate: {
        payload: {
          title: Joi.string().min(10).max(50).required(),
          artist: Joi.string().min(10).max(50).required()
        }
      }
    }*/
  });

  next();
};

plugin.register.attributes = {
  name: "addRecordsPlugin",
  version: "0.0.1"
};

module.exports = plugin;
