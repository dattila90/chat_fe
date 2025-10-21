import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10">
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl font-extrabold text-white mb-4">
                ChatApp
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                The modern way to stay connected. Secure, fast, and beautiful
                messaging for everyone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Register
              </Link>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-4">🔒</div>
                <h3 className="text-xl font-semibold mb-2">Secure</h3>
                <p className="text-blue-100 text-sm">
                  End-to-end encryption keeps your conversations private and
                  secure.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Fast</h3>
                <p className="text-blue-100 text-sm">
                  Lightning-fast message delivery with real-time
                  synchronization.
                </p>
              </div>
              <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                <div className="text-3xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-2">Beautiful</h3>
                <p className="text-blue-100 text-sm">
                  Clean, modern interface designed for the best user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
