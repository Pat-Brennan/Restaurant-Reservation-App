const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * List handler for reservation resources
 */
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

function isValidTime(value) {
  var hasMeridian = false;
  var re = /^\d{1,2}[:]\d{2}([:]\d{2})?( [aApP][mM]?)?$/;
  if (!re.test(value)) { return false; }
  if (value.toLowerCase().indexOf("p") != -1) { hasMeridian = true; }
  if (value.toLowerCase().indexOf("a") != -1) { hasMeridian = true; }
  var values = value.split(":");
  if ((parseFloat(values[0]) < 0) || (parseFloat(values[0]) > 23)) { return false; }
  if (hasMeridian) {
    if ((parseFloat(values[0]) < 1) || (parseFloat(values[0]) > 12)) { return false; }
  }
  if ((parseFloat(values[1]) < 0) || (parseFloat(values[1]) > 59)) { return false; }
  if (values.length > 2) {
    if ((parseFloat(values[2]) < 0) || (parseFloat(values[2]) > 59)) { return false; }
  }
  return true;
}

function validateData(req, res, next) {
  const data = res.locals.data;
  const errors = [];
  const date = new Date(`${data.reservation_date}T${data.reservation_time}`);
  const today = new Date();
  if (!data.first_name || data.first_name.length < 1) {
    errors.push("Request is missing first_name");
  }
  if (!data.last_name || data.last_name.length < 1) {
    errors.push("Request is missing last_name")
  }
  if (!data.mobile_number || data.mobile_number.length < 1) {
    errors.push("Request is missing mobile_number")
  }
  if (!data.reservation_date || !Date.parse(data.reservation_date)) {
    errors.push("Request is missing a reservation_date")
  }
  if (date.getDay() === 2) {
    errors.push("The restaurant is closed on Tuesdays. Please pick a different day.");
  }
  if (date - today < 0) {
    errors.push("Please pick a date in the future.")
  }
  if (!data.reservation_time || !isValidTime(data.reservation_time)) {
    errors.push("Request is missing reservation_time")
  }
  if (date.getHours() <= 10) {
    if (date.getHours() === 10 && date.getMinutes() < 30) {
      errors.push("Restaurant opens at 10:30am. Please pick a later time.")
    }
    errors.push("Restaurant opens at 10:30. Please pick a later time.")
  }
  if (date.getHours() >= 21) {
    if (date.getHours() === 21 && date.getMinutes() > 30) {
      errors.push("Restaurant closes at 10:30pm. We would like you to have time to enjoy your meal. Please pick an earlier time.")
    }
    errors.push("Restaurant closes at 10:30pm. We would like you to have time to enjoy your meal. Please pick an earlier time.")
  }
  if (!data.people || data.people === 0 || typeof
    data.people !== "number") {
    errors.push("Request is missing people")
  }
  if (data.status === "seated" || data.status === "finished") {
    errors.push(`Status cannot equal ${data.status}. Status must be 'booked'`)
  }
  if (errors.length === 0) {
    return next();
  }
  next({
    status: 400,
    message: errors.join("; ")
  })
}

async function reservationExists(req, res, next) {
  const id = req.params.reservation_id;
  const foundReservation = await service.read(id);
  if (foundReservation) {
      res.locals.reservation = foundReservation;
      return next();
  } 
  next({
      status: 404,
      message: `Table with id: ${id} not found.`
  })
}

function validateStatus(req, res, next) {
  const data = res.locals.data;
  const validStatus = ["seated", "booked", "finished", "cancelled"];
  if (validStatus.includes(data.status)) {
    return next();
  }
  next({
    status: 400,
    message: "Body of request contains unknown status."
  })
  // if (validateStatus === "finished") {
  //   next({
  //     status: 400,
  //     message: "A finished reservation cannot be updated"
  //   })
  // }
}

function resIsFinished(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message:"Reservation with a status of finished cannot be updated."
  })
}

async function update(req, res) {
  const data = res.locals.data;
  const resId = res.locals.reservation.reservation_id;
  const result = await service.update(resId, data);
  res.json({ data: result[0] });
}

async function updateStatus(req, res) {
  const resId = res.locals.reservation.reservation_id;
  const status = res.locals.data.status;
  const data = await service.update(resId, { status });
  res.status(200).json({ data: data[0] });
}

async function list(req, res) {
  const date = req.query.date;
  const phone = req.query.mobile_number;
  const data = await service.list(date, phone);
  res.json({
    data: data,
  });
}

async function create(req, res) {
  const newReservation = req.body.data;
  const data = await service.create(newReservation);
  res.status(201).json({ data: data[0] });
}

function read(req, res) {
  const reservation = res.locals.reservation;
  res.json({ data: reservation });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasData, validateData, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    hasData,
    asyncErrorBoundary(reservationExists),
    validateStatus,
    resIsFinished,
    asyncErrorBoundary(updateStatus)
  ],
  update: [
    hasData,
    validateData,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ]
};
