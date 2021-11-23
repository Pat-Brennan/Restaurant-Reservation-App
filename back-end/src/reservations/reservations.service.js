const knex = require("../db/connection");

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation);
}

module.exports = {
    create,
}