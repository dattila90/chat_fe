import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (user: any) => {
    console.log("Login successful, redirecting user:", user);

    // Redirect to the page they were trying to access, or chats by default
    const from = (location.state as any)?.from?.pathname || "/chats";
    navigate(from, { replace: true });
  };

  return (
    <LoginForm
      onBack={() => navigate("/")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
}

export default LoginPage;
