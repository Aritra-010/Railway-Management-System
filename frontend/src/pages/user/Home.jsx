import { Link } from "react-router-dom";
import "./css files/Home.css";

import { useState, useEffect } from "react";

import {
  FaTicketAlt,
  FaClipboardList,
  FaTrain,
  FaSearchLocation,
} from "react-icons/fa";

function Home() {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceFocused, setSourceFocused] = useState(false);
  const [destinationFocused, setDestinationFocused] = useState(false);

  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);

  // FETCH STATIONS
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {

    try {

      const response = await fetch(
        "http://localhost:8000/user/stations"
      );

      const data = await response.json();

      setStations(data.stations);

    } catch (error) {

      console.log(error);
    }
  };

  // SEARCH FUNCTION
  const handleSearch = async () => {

    // prevent empty search
    if (!source || !destination) {
      alert("Please enter source and destination");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8000/user/search-trains",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            source,
            destination,
          }),
        }
      );

      const data = await response.json();

      setTrains(data.trains);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch trains");
    }
  };

  return (
    <div className="home-container">
      {/* LEFT SECTION */}
      <div className="left-section">
        {/* BOOK TICKET CARD */}
        <div className="dashboard-card">
          <div className="card-icon blue">
            <FaTicketAlt />
          </div>

          <h2>Book Ticket</h2>

          <p>
            Search trains, reserve your tickets
            easily.
          </p>

          <Link to="/ticket-booking">
            <button className="card-button blue-btn">Book Now</button>
          </Link>
        </div>

        {/* MY BOOKINGS CARD */}
        <div className="dashboard-card">
          <div className="card-icon green">
            <FaClipboardList />
          </div>

          <h2>My Bookings</h2>

          <p>
            View all your booked tickets, travel details.
          </p>

          <Link to="/my-booking">
            <button className="card-button green-btn">View Bookings</button>
          </Link>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="right-section">
        <div className="search-panel">
          <div className="search-header">
            <div className="search-header-icon">
              <FaTrain />
            </div>
            <div>
              <h2>Search Train</h2>
              <p>Look for the available trains</p>
            </div>
          </div>

          <div className="search-fields">
            <div className="input-group">
              <FaSearchLocation className="input-icon" />
              <div className="autocomplete-field">
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  onFocus={() => setSourceFocused(true)}
                  onBlur={() => setTimeout(() => setSourceFocused(false), 150)}
                  placeholder="From station"
                  className="search-input"
                />
                {sourceFocused && (
                  <ul className="suggestions-dropdown">
                    {stations
                      .filter((station) =>
                        source === ""
                          ? true
                          : station
                              .toLowerCase()
                              .includes(source.toLowerCase()),
                      )
                      .map((station, index) => (
                        <li
                          key={index}
                          className="suggestion-item"
                          onMouseDown={() => setSource(station)}
                        >
                          <div className="suggestion-text">
                            <FaSearchLocation className="suggestion-icon" />
                            <span>{station}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="input-group">
              <FaSearchLocation className="input-icon" />
              <div className="autocomplete-field">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onFocus={() => setDestinationFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setDestinationFocused(false), 150)
                  }
                  placeholder="To station"
                  className="search-input"
                />
                {destinationFocused && (
                  <ul className="suggestions-dropdown">
                    {stations
                      .filter((station) =>
                        destination === ""
                          ? true
                          : station
                              .toLowerCase()
                              .includes(destination.toLowerCase()),
                      )
                      .map((station, index) => (
                        <li
                          key={index}
                          className="suggestion-item"
                          onMouseDown={() => setDestination(station)}
                        >
                          <div className="suggestion-text">
                            <FaSearchLocation className="suggestion-icon" />
                            <span>{station}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="button-row">
            <button
              type="button"
              className="search-button"
              onClick={handleSearch}
            >
              Search Trains
            </button>
          </div>

          {trains.length > 0 && (
            <div className="result-header">
              <h3 className="available-title">Available Trains</h3>
              <span className="result-badge">
                {trains.length} result{trains.length > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="train-list">
            {trains.length > 0 ? (
              trains.map((train, index) => (
                <div className="train-card" key={index}>
                  <div className="train-left">
                    <FaTrain className="train-icon" />
                    <div className="train-info">
                      <p className="train-number">{train.train_number}</p>

                      <p className="train-name">{train.train_name}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-trains-card">
                <p className="no-trains">
                  No stations selected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;