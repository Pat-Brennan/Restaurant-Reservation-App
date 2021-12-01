import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { next, previous } from "../utils/date-time";
import { useHistory } from "react-router-dom";

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

  if (query.get("date")) {
    date = query.get("date");
  } 

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }



  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
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
                <p>{r.people }</p>
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
      <ErrorAlert error={reservationsError} />
      {/*JSON.stringify(reservations)*/}
    </main>
  );
}

export default Dashboard;
