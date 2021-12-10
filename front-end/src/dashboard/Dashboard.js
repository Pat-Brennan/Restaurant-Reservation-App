import React, { useEffect, useState } from "react";
import { useHistory, Route, Switch } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { next, previous } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import SeatReservation from "../reservations/SeatReservation"
import EditReservation from "../reservations/EditReservation";
import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";

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
          <ListReservations reservations={ reservations }/>
      <div>
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard`)}>Today</button>
      </div>
          <ErrorAlert error={tablesError} />
          <ListTables tables={ tables }/>
      </main>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
          <SeatReservation tables={tables} loadDashboard={loadDashboard} />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
    </Switch>
  );
}

export default Dashboard;
