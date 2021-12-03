import React from "react";
import { updateReservationStatus } from "../utils/api";
import { useHistory } from "react-router-dom";

function ListReservations({ reservations }) {
	const history = useHistory();

	const cancelReservation = (resId) => {
		const message =
			"Do you want to cancel this reservation? This cannot be undone.";
		const response = window.confirm(message);
		if (response) {
			updateReservationStatus(resId, "cancelled")
				.then(() => {
					history.go();
				})
				.catch(console.log);
		}
	};

	return (
		<>
			<main>
				{reservations.length === 0 ? (
					<h5>No reservations found</h5>
				) : (
					<ol>
						{reservations.map((r) => {
							return (
								<li key={r.reservation_id}>
									<p>
										{r.first_name} {r.last_name}
									</p>
									<p>Phone: {r.mobile_number}</p>
									<p>Reservation Time: {r.reservation_time}</p>
									<p>Party Size: {r.people}</p>
									<p data-reservation-id-status={r.reservation_id}>
										{r.status}
									</p>
									{r.status === "booked" ? (
										<div>
											<a href={`/reservations/${r.reservation_id}/seat`}>
												<button type="button" className="btn btn-secondary">
													Seat
												</button>
											</a>
											<a href={`/reservations/${r.reservation_id}/edit`}>
												<button type="button" className="btn btn-secondary">
													Edit
												</button>
											</a>
											<button
												type="button"
												className="btn btn-danger"
												data-reservation-id-cancel={r.reservation_id}
												onClick={() => cancelReservation(r.reservation_id)}
											>
												Cancel
											</button>
										</div>
									) : (
										""
									)}
								</li>
							);
						})}
					</ol>
				)}
			</main>
		</>
	);
}

export default ListReservations;