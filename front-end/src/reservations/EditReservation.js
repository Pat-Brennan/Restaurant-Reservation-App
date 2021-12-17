import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Form from "./Form";

function EditReservation() {
    const history = useHistory();
    const params = useParams();

    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});

    const reservationId = Number(params.reservation_id);

    useEffect(() => {
        const abortController = new AbortController();
        setError(null);
        setFormData({});
        readReservation(reservationId, abortController.signal)
            .then(setFormData)
            .catch(setError);
        return () => abortController.abort();
    }, [reservationId]);

    const changeHandler = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const cancelHandler = () => {
        history.goBack();
    }

    const submitHandler = (event) => {
        event.preventDefault();
        formData.people = Number(formData.people);
        updateReservation(reservationId, formData)
            .then(() => {
                history.push(`/dashboard?date=${formData.reservation_date}`);
            })
            .catch(setError);
    }


    return (
        <>
            <h1>Edit Reservation</h1>
            <ErrorAlert error={error} />
            <Form submitHandler={submitHandler} formData={formData} changeHandler={changeHandler} cancelHandler={cancelHandler} />
        </>
    )
}

export default EditReservation;