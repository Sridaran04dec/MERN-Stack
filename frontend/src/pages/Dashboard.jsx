import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");
    navigate("/login", { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome{user?.name ? `, ${user.name}` : "!"}</h2>
        <p>You have successfully logged in.</p>

        {user?.email && (
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        )}

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;