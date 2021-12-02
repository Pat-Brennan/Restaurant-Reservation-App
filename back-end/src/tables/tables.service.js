const knex = require("../db/connection");

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*");
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

function read(tableId) {
    return knex("tables")
        .where({ "table_id": tableId })
        .first();
}

function readReservation(resId) {
    return knex("reservations")
        .where({ "reservation_id": resId })
        .first();
}

function update(tableId, resId) {
    return knex("tables")
        .where({ "table_id": tableId })
        .update({
            "reservation_id": resId,
            "status": "Occupied"
        })
        .returning("*");
}

module.exports = {
    create,
    list,
    read,
    readReservation,
    update
}