import {
  FaSearchLocation,
  FaTrain,
  FaCalendarAlt,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css files/ticket_booking.css";

function TicketBooking() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [date, setDate] = useState(getToday());
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);

  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  const navigate = useNavigate();

  // Fetch Stations
  useEffect(() => {
    fetch("http://127.0.0.1:8000/user/stations")
      .then((res) => res.json())
      .then((data) => setStations(data.stations || []))
      .catch(() => setStations([]));
  }, []);

  // Search Trains
  const searchTrains = async () => {
    if (!stations.includes(from) || !stations.includes(to)) {
      alert("Select valid stations");
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/user/ticket-booking/search?source=${from}&destination=${to}`,
      );

      const data = await res.json();
      setTrains(data.trains || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Navigate Booking
  const handleBook = (train) => {
    navigate("/booking-details", {
      state: { train, from, to, date },
    });
  };

  // Filter Stations
  const filterStations = (value) =>
    stations.filter((s) => s.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="ticket-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Search Trains</h1>
          <p>Book railway tickets quickly and easily</p>
        </div>

        {/* FORM */}
        <div className="search-fields">
          {/* FROM */}
          <div className="input-group">
            <FaSearchLocation className="input-icon" />

            <div className="autocomplete-field">
              <input
                type="text"
                placeholder="From station"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setShowFrom(true);
                }}
                className="search-input"
              />

              {showFrom && from && (
                <ul className="suggestions-dropdown">
                  {filterStations(from).map((s, i) => (
                    <li
                      key={i}
                      className="suggestion-item"
                      onMouseDown={() => {
                        setFrom(s);
                        setShowFrom(false);
                      }}
                    >
                      <div className="suggestion-text">
                        <FaSearchLocation className="suggestion-icon" />
                        <span>{s}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* TO */}
          <div className="input-group">
            <FaSearchLocation className="input-icon" />

            <div className="autocomplete-field">
              <input
                type="text"
                placeholder="To station"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setShowTo(true);
                }}
                className="search-input"
              />

              {showTo && to && (
                <ul className="suggestions-dropdown">
                  {filterStations(to).map((s, i) => (
                    <li
                      key={i}
                      className="suggestion-item"
                      onMouseDown={() => {
                        setTo(s);
                        setShowTo(false);
                      }}
                    >
                      <div className="suggestion-text">
                        <FaSearchLocation className="suggestion-icon" />
                        <span>{s}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* DATE */}
          <div className="input-group">
            <FaCalendarAlt className="input-icon" />

            <div className="autocomplete-field">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="button-row">
            <button className="search-button" onClick={searchTrains}>
              Search Trains
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="train-results">
          {trains.length === 0 ? (
            <div className="no-trains">No trains found</div>
          ) : (
            trains.map((train) => (
              <div className="train-card" key={train.train_id}>
                <div className="train-info">
                  <h3>{train.train_name}</h3>

                  <p>
                    Train Number :<span> {train.train_number}</span>
                  </p>
                </div>

                <button className="book-btn" onClick={() => handleBook(train)}>
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketBooking;