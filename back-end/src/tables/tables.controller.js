const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res) {
    const data = req.body.data;
    const newTable = await service.create(data);
    res.status(201).json({ data: newTable });
}

async function list(req, res) {
    const tables = await service.list();
    res.json({ data: tables });
}

module.exports = {
    create: [asyncErrorBoundary(create)],
    list: asyncErrorBoundary(list),
}