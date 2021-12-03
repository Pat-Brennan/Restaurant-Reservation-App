import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

import { createReservation } from "../utils/api";

function NewReservation() {
    const history = useHistory();
    const [newReservation, setNewReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1
    });
    const [error, setError] = useState(null);

    const changeHandler = ({target}) => {
        setNewReservation({
            ...newReservation,
            [target.name]: target.value,
        });
    }

    const submitHandler = (event) => {
        event.preventDefault();
        createReservation(newReservation)
            .then(() => {
                history.push(`/dashboard?date=${newReservation.reservation_date}`)
            })
            .catch(setError);
    }

    return (
        <>
            <ErrorAlert error={error} />
            <form onSubmit={submitHandler}>

                <div>
                <label htmlFor="first_name">First Name:</label>
                <input
                    type="text"
                    placeholder="First Name Here"
                    name="first_name"
                    id="first_name"
                    value={newReservation.first_name}
                    onChange={changeHandler}
                    required
                />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name:</label>
                    <input
                        type="text"
                        placeholder="Last Name Here"
                        name="last_name"
                        id="last_name"
                        value={newReservation.last_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="mobile_number"> Mobile Number:</label>
                    <input
                        type="text"
                        placeholder="(666)666-6666"
                        name="mobile_number"
                        id="mobile_number"
                        value={newReservation.mobile_number}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                <label htmlFor="reservation_date">Date:</label>
                <input
                    type="date"
                    name="reservation_date"
                    id="reservation_date"
                    onChange={changeHandler}
                    value={newReservation.reservation_date}
                    required
                />
                </div>
                <div>
                    <label htmlFor="reservation_time">Time:</label>
                    <input
                        type="time"
                        name="reservation_time"
                        id="reservation_time"
                        onChange={changeHandler}
                        value={newReservation.reservation_time}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="people">Number of Guests:</label>
                    <input
                        type="number"
                        name="people"
                        id="people"
                        onChange={changeHandler}
                        value={newReservation.people}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                <button
                    type="cancel"
                    className="btn btn-danger"
                    onClick={() => history.goBack()}>
                    Cancel
                </button>
        </form>
    </>
    )
}

export default NewReservation;