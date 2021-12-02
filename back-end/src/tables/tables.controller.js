const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasData(req, res, next) {
    if (req.body.data) {
      res.locals.data = req.body.data;
      return next();
    }
    next({
      status: 400,
      message: "Request has no data"
    });
  }

function validateData(req, res, next) {
    const data = res.locals.data;
    const errors = [];
    if (!data.table_name || data.table_name.length < 2) {
        errors.push("Request body is missing a 'table_name' key.")
    }
    if (!data.capacity || data.capacity === 0 || typeof data.capacity !== "number") {
        errors.push("Request body is missing a 'capacity' key.")
    }
    if (errors.length === 0) {
        return next();
    }
    next({
        status: 400,
        message: `${errors.join("; ")}`
    });
}

async function reservationExists(req, res, next) {
    const data = res.locals.data;
    const id = data.reservation_id;
    if (id === undefined) {
        return next({
            status: 400,
            message: "Request is missing a 'reservation_id' key."
        });
    }
    const foundRes = await service.readReservation(id);
    if (foundRes) {
        res.locals.reservation = foundRes;
        return next();
    }
    next({
        status: 404,
        message: `Reservation with id: ${id} does not exist.`
    });
}

async function tableExists(req, res, next) {
    const id = req.params.table_id;
    const foundTable = await service.read(id);
    if (foundTable) {
        res.locals.table = foundTable;
        return next();
    }
    next({
        status: 404,
        message: `Table with id: ${id} not found.`
    })
}

function tableFitsReservation(req, res, next) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;
    const errors = [];
    if (table.capacity < reservation.people) {
        errors.push(`${table.table_name} does not have sufficient capacity. Please pick a different table.`)
    }
    if (table.status === "Occupied") {
        errors.push(`${table.table_name} is already occupied. Please pick a different table`)
    }
    if (errors.length === 0) {
        return next();
    }
    next({
        status: 400,
        message: `${errors.join("; ")}`
    });
}

async function create(req, res) {
    const data = req.body.data;
    const newTable = await service.create(data);
    res.status(201).json({ data: newTable[0] });
}

async function list(req, res) {
    const tables = await service.list();
    res.json({ data: tables });
}

async function update(req, res) {
    const table = res.locals.table;
    const reservation = res.locals.reservation;
    await service.update(table.table_id, reservation.reservation_id);
    res.json({});
}

module.exports = {
    create: [
        hasData,
        validateData,
        asyncErrorBoundary(create)
    ],
    list: asyncErrorBoundary(list),
    update: [
        hasData,
        asyncErrorBoundary(reservationExists),
        asyncErrorBoundary(tableExists),
        tableFitsReservation,
        asyncErrorBoundary(update)]
}