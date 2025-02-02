import React from "react";

function Form({submitHandler, formData, changeHandler, cancelHandler}) {

    return (
        <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        id="first_name"
                        placeholder="First Name Here"
                        value={formData.first_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="first_last" className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        id="last_name"
                        placeholder="Last Name Here"
                        value={formData.last_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="mobile_number" className="form_label">Mobile Number</label>
                    <input
                        type="tel"
                        name="mobile_number"
                        className="form-control"
                        id="mobile_number"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        placeholder="xxx-xxx-xxxx"
                        value={formData.mobile_number}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                <label htmlFor="reservation_date" className="form-label">Date of Reservation</label>
                    <input
                        type="date"
                        name="reservation_date"
                        className="form-control"
                        id="reservation_date"
                        pattern="\d{4}-\d{2}-\d{2}"
                        placeholder="YYYY-MM-DD"
                        value={formData.reservation_date}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                <label htmlFor="reservation_time" className="form-label">Time of Reservation</label>
                    <input
                        type="time"
                        name="reservation_time"
                        className="form-control"
                        id="reservation_time"
                        pattern="[0-9]{2}:[0-9]{2}"
                        placeholder="HH:MM"
                        value={formData.reservation_time}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                <label htmlFor="people" className="form-label">Party Size</label>
                    <input
                        type="number"
                        name="people"
                        className="form-control"
                        id="people"
                        min="1"
                        value={formData.people}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-danger" onClick={cancelHandler}>Cancel</button>
                </div>
            </form>
    )

}

export default Form;