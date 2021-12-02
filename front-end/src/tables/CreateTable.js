import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api"
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable() { 
    const history = useHistory();

    const initialFormState = {
        table_name: "",
        capacity: "",
    };

    const [table, setTable] = useState({ ...initialFormState });
    const [error, setError] = useState(null);

    const changeHandler = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.value,
        });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        createTable(table)
            .then(() => {
                history.push("/dashboard");
            })
            .catch(setError);
    };
    
        const cancelHandler = () => {
            history.goBack();
        };

    
    return (
			<>
				<h1>Add New Table</h1>
				<ErrorAlert error={error} />
				<form onSubmit={submitHandler}>
					<div>
						<label htmlFor="table_name" className="form-label">
							Table Name:
						</label>
						<input
							type="text"
							name="table_name"
							id="table_name"
							minLength="2"
							value={table.table_name}
							onChange={changeHandler}
							required
						/>
					</div>
					<div>
						<label htmlFor="capacity" className="form-label">
							capacity:
						</label>
						<input
							type="number"
							name="capacity"
							id="capacity"
							className="form-control"
							min="1"
							value={table.capacity}
							onChange={changeHandler}
							required
						/>
					</div>
					<div>
						<button type="submit" className="btn btn-primary">
							Submit
						</button>
                    <button type="button" className="btn btn-danger" onClick={cancelHandler}>
							Cancel
						</button>
					</div>
				</form>
			</>
		);
}

export default CreateTable;