import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (user: any) => {
    console.log("Registration successful:", user);
    // Redirect to chats after successful registration
    navigate("/chats");
  };

  return (
    <RegisterForm
      onBack={() => navigate("/")}
      onRegisterSuccess={handleRegisterSuccess}
    />
  );
}

export default RegisterPage;
