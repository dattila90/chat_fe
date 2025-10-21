import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-8">
          <h1 className="text-9xl font-bold mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-xl text-blue-100 mb-8">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <Link
          to="/"
          className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-block"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
