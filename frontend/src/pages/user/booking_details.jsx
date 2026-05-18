import { useLocation } from "react-router-dom";
import { useState } from "react";

import {
  FaTrain,
  FaPhoneAlt,
  FaUsers,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "./css files/booking_details.css";

function BookingDetails() {

  const location = useLocation();
  const { train, from, to, date } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [numPassengers, setNumPassengers] = useState(1);
  const [passengers, setPassengers] = useState([
    {
      name: "",
      age: "",
      gender: "",
      coach: "",
    },
  ]);

  // PASSENGER COUNT
  const handlePassengerCount = (value) => {
    const count = parseInt(value) || 0;
    setNumPassengers(count);
    const newPassengers = [];
    for (let i = 0; i < count; i++) {
      newPassengers.push({
        name: "",
        age: "",
        gender: "",
        coach: "",
      });
    }

    setPassengers(newPassengers);
  };

  // HANDLE CHANGE
  const handleChange = (index, field, value) => {

    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // CONFIRM BOOKING
  const confirmBooking = async () => {
    if (loading) return;
    if (!phone) {
      alert("Phone number is required");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Incorrect phone number");
      return;
    }
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.name || !p.age || !p.gender || !p.coach) {
        alert(`Fill all details for Passenger ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
      const payload = {
        train_id: train.train_id,
        journey_date: date,
        phone_number: phone,
        source: from,
        destination: to,
        passengers: passengers.map((p) => ({
          name: p.name,
          age: parseInt(p.age),
          gender: p.gender.toUpperCase(),
          coach_type: p.coach.toUpperCase(),
        })),
      };

      const res = await fetch(
        "http://127.0.0.1:8000/user/ticket-booking/confirm",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || JSON.stringify(err));
        setLoading(false);
        return;
      }

      const data = await res.json();
      alert(`Booking Successful!\nPNR: ${data.pnr}`);
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-wrapper">
        {/* HEADER */}
        <div className="booking-title-section">
          <h1>Booking Details</h1>
          <p>Complete passenger information and confirm your ticket</p>
        </div>

        {/* TRAIN CARD */}
        <div className="train-summary-card">
          <div className="summary-top">
            <div className="summary-icon">
              <FaTrain />
            </div>

            <div>
              <h2>{train?.train_name}</h2>
              <p>Train Number : {train?.train_number}</p>
            </div>
          </div>

          <div className="route-section">
            <div className="route-box">
              <FaMapMarkerAlt />
              <span>{from}</span>
            </div>

            <div className="route-arrow">→</div>

            <div className="route-box">
              <FaMapMarkerAlt />
              <span>{to}</span>
            </div>
          </div>

          <div className="journey-date">
            <FaCalendarAlt />
            <span>{date}</span>
          </div>
        </div>

        {/* PHONE + PASSENGERS */}

        <div className="form-grid">
          <div className="input-card">
            <label>
              <FaPhoneAlt /> Phone Number
            </label>

            <input
              type="text"
              placeholder="Enter 10-digit phone number"
              value={phone}
              maxLength={10}
              onChange={(e) => {
                // allow only digits
                const value = e.target.value.replace(/\D/g, "");

                setPhone(value);
              }}
            />

            {/* ERROR MESSAGE */}
            {phone.length > 0 && phone.length !== 10 && (
              <p className="phone-error">Incorrect phone number</p>
            )}
          </div>

          <div className="input-card">
            <label>
              <FaUsers />
              Number of Passengers
            </label>

            <input
              type="number"
              min="1"
              value={numPassengers}
              onChange={(e) => handlePassengerCount(e.target.value)}
            />
          </div>
        </div>

        {/* PASSENGERS */}

        <div className="passenger-section">
          <h2>Passenger Details</h2>

          {passengers.map((p, index) => (
            <div className="passenger-card" key={index}>
              <div className="passenger-header">
                <FaUser />
                <span>Passenger {index + 1}</span>
              </div>

              <div className="passenger-fields">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={p.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Age"
                  value={p.age}
                  onChange={(e) => handleChange(index, "age", e.target.value)}
                />

                <select
                  value={p.gender}
                  onChange={(e) =>
                    handleChange(index, "gender", e.target.value)
                  }
                >
                  <option value="">Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Others</option>
                </select>

                <select
                  value={p.coach}
                  onChange={(e) => handleChange(index, "coach", e.target.value)}
                >
                  <option value="">Coach</option>
                  <option value="GS">GS</option>
                  <option value="SL">SL</option>
                  <option value="3A">3A</option>
                  <option value="2A">2A</option>
                  <option value="1A">1A</option>
                  <option value="CC">CC</option>
                  <option value="2S">2S</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON */}

        <button
          className="confirm-btn"
          onClick={confirmBooking}
          disabled={loading}
        >
          {loading ? "Booking..." : "Confirm & Book"}
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;