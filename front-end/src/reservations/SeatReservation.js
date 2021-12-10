import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation({ tables, loadDashboard }) {
    const history = useHistory();
    const params = useParams();

    const [reservation, setReservation] = useState({});
    const [formData, setFormData] = useState("");
    const [error, setError] = useState(null);

    const reservationId = Number(params.reservation_id);

    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        setReservation({});
        readReservation(reservationId, abortController.signal)
            .then(setReservation)
            .catch(setError);
        return () => abortController.abort();
    }, [reservationId]);

    const changeHandler = ({ target }) => {
        setFormData(target.value);
    }

    const cancelHandler = () => {
        history.goBack();
    }

    const submitHandler = (event) => {
        event.preventDefault();
        const table = tables.find(t => t.table_id === Number(formData));
        if (table.capacity < reservation.people) {
            setError({ message: `${table.table_name} cannot accomodate party size. Please pick a different table.` })
        } else {
            updateTable(table.table_id, reservation.reservation_id)
                .then(() => {
                    loadDashboard();
                    history.push(`/dashboard?date=${reservation.reservation_date}`);
                })
                .catch(setError);
        }
    }


    return(
        <>
            <main>
                <h1>Seat Reservation</h1>
                <h3>{reservation.first_name} {reservation.last_name} party of {reservation.people}</h3>
                <ErrorAlert error={error} />
                <form onSubmit={submitHandler}>
                    <label htmlFor="table_id" className="form-label" />
                        <select
                            className="form-select"
                            name="table_id"
                            id="table_id"
                            onChange={changeHandler}
                            value={formData}
                            required>
                            <option value=""> --Please select a table-- </option>
                            {tables.map(t => {
                                return (
                                    <option key={t.table_id} value={t.table_id}>{t.table_name} - {t.capacity}</option>
                                )
                            })}
                    </select>
                    <div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type="button" className="btn btn-danger" onClick={cancelHandler}>Cancel</button>
                    </div>
                </form>
            </main>
        </>
    )

}

export default SeatReservation;