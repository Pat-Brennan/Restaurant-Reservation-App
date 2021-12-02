import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { next, previous } from "../utils/date-time";
import { useHistory, Route, Switch } from "react-router-dom";
import SeatReservation from "../reservations/SeatReservation"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  if (query.get("date")) {
    date = query.get("date");
  } 

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }



  return (
    <Switch>
      <Route exact={true} path="/dashboard">
        <main>
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for date: { date }</h4>
          </div>
          <ErrorAlert error={reservationsError} />
          {reservations.length === 0
            ? <h3>You fucked up</h3>
            : <ol>
            {reservations.map(r => {
              return (
                <li key={r.reservation_id}>
                  <p>{r.first_name} {r.last_name}</p>
                  <p>{r.mobile_number}</p>
                  <p>{r.reservation_date}</p>
                  <p>{r.reservation_time}</p>
                  <p>{r.people}</p>
                  <a href={`/reservations/${r.reservation_id}/seat`}>
                    <button type="buttton" className="btn btn-secondary">
                      Seat
                      </button>
                  </a>
                  </li>
                )
              })}
          </ol>
          }
      <div>
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard`)}>Today</button>
      </div>
      <ErrorAlert error={tablesError} />
      {tables.length === 0
        ? <h3>You fucked up twice</h3>
        : <ol>
          {tables.map(t => {
            return (
              <li key={t.table_id}>
                <p>{t.table_name} -- <span data-table-id-status={t.table_id}>{t.status}</span></p>
              </li>
            )
          }) }
        </ol>}
      </main>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
          <SeatReservation tables={tables} />
      </Route>
    </Switch>
  );
}

export default Dashboard;
