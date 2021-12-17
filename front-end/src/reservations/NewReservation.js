import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import Form from "./Form";

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

    const cancelHandler = () => {
        history.goBack();
    }

    const submitHandler = (event) => {
        event.preventDefault();
        newReservation.people = Number(newReservation.people);
        createReservation(newReservation)
            .then(() => {
                history.push(`/dashboard?date=${newReservation.reservation_date}`)
            })
            .catch(setError);
    }

    return (
        <>
        <h1>Create Reservation</h1>
            <ErrorAlert error={error} />
            <Form submitHandler={submitHandler} formData={newReservation} changeHandler={changeHandler} cancelHandler={cancelHandler} />
    </>
    )
}

export default NewReservation;