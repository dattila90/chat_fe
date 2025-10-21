import { useNavigate } from "react-router-dom";
import { type UserAccount } from "../api/auth";

interface HeaderProps {
  user: UserAccount;
  onLogout?: () => void;
}

function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Default logout behavior
      localStorage.removeItem("authToken");
      navigate("/");
    }
  };

  return (
    <header className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">ChatApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user.first_name}!</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
