const knex = require("../db/connection");

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*");
}

function list(date) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_date": date })
        .orderBy("reservation_time");
}

function read(id) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_id": id })
        .first();
}

module.exports = {
    create,
    list,
    read,
}