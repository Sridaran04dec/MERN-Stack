import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/auth/users"
      );

      setUsers(response.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load user records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <main className="dashboard-page">

      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">ADMINISTRATION</p>
          <h1>User Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage and view your registered users.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="refresh-button"
            onClick={fetchUsers}
            disabled={loading}
          >
            ↻ {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            ↪ Logout
          </button>
        </div>
      </header>


      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon users-icon">♙</div>
          <div>
            <p>Total Registered Users</p>
            <h2>{users.length}</h2>
            <span>All registered accounts</span>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon records-icon">▤</div>
          <div>
            <p>Matching Records</p>
            <h2>{filteredUsers.length}</h2>
            <span>Based on your search</span>
          </div>
        </article>
      </section>

      <section className="users-panel">
        <div className="panel-header">
          <div>
            <h2>Registered Users</h2>
            <p>User details and registration timestamps</p>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={fetchUsers}>Try again</button>
          </div>
        )}

        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>USER</th>
                <th>EMAIL ADDRESS</th>
                <th>REGISTERED DATE & TIME</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="table-message">
                    Loading user records...
                  </td>
                </tr>
              ) : error ? null : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="table-message">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <div className="date-cell">
                        <span>{formatDateTime(user.createdAt)}</span>
                        <small>Local time</small>
                      </div>
                    </td>

                    <td>
                      <span className="status-pill">
                        <span className="status-dot" />
                        Registered
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="table-footer">
          Showing {filteredUsers.length} of {users.length} users
        </footer>
      </section>
    </main>
  );
}

export default Dashboard;
