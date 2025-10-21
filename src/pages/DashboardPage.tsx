import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI, type UserAccount } from "../api/auth";
import { conversationsAPI, type Conversation } from "../api/conversations";
import DashboardFooter, { type TabType } from "../components/DashboardFooter";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("chats");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user account data and conversations in parallel
        const [userData, conversationsData] = await Promise.all([
          authAPI.fetchAccount(),
          conversationsAPI.getConversations(),
        ]);

        setUser(userData);
        setConversations(conversationsData);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");

        // If token is invalid, redirect to login
        if (
          err.message?.includes("Unauthorized") ||
          err.message?.includes("401")
        ) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "chats":
        return (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">Your Conversations</h3>

            {conversations.length === 0 ? (
              <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
                <p className="text-blue-100 text-lg">No conversations yet</p>
                <p className="text-blue-200 text-sm mt-2">
                  Start a new chat to see it here
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">
                          {conversation.name ||
                            conversation.participants
                              .filter((p) => p.id !== user?.id)
                              .map((p) => p.full_name)
                              .join(", ") ||
                            "Unknown Chat"}
                        </h4>

                        {conversation.last_message && (
                          <p className="text-blue-100 text-sm mb-2">
                            <span className="font-medium">
                              {conversation.last_message.sender?.full_name}:
                            </span>{" "}
                            {conversation.last_message.content}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-blue-200 text-xs">
                          <span className="capitalize">
                            {conversation.type} chat
                          </span>
                          <span>
                            {conversation.participants.length} participants
                          </span>
                          <span>
                            Updated:{" "}
                            {new Date(
                              conversation.updated_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="ml-4">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Open Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "friends":
        return (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">Your Friends</h3>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
              <p className="text-blue-100 text-lg">No friends yet</p>
              <p className="text-blue-200 text-sm mt-2">
                Send friend requests to connect with others
              </p>
            </div>
          </div>
        );

      case "friend-requests":
        return (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">Friend Requests</h3>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
              <p className="text-blue-100 text-lg">No pending requests</p>
              <p className="text-blue-200 text-sm mt-2">
                Friend requests will appear here
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading user data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-xl mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">No user data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="relative z-10">
        {/* Header */}
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

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-8 text-center">
              Welcome to your Dashboard!
            </h2>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </main>
      </div>

      {/* Dashboard Footer */}
      <DashboardFooter
        conversationCount={conversations.length}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default DashboardPage;
