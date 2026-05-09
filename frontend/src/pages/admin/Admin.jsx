import { Link } from "react-router-dom";

function Admin() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginTop: "30px" }}>
        <Link to="/admin/add-station">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Add Station
          </button>
        </Link>

        <Link to="/admin/add-train">
          <button style={{ margin: "10px", padding: "10px 20px" }}>
            Add Train
          </button>
        </Link>

      </div>
    </div>
  );
}

export default Admin;