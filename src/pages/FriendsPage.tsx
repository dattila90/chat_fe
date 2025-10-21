import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI, type UserAccount } from "../api/auth";
import { friendsAPI, type Friend } from "../api/friends";
import AppLayout from "../layouts/AppLayout";
import ChatsNavigation from "../components/ChatsNavigation";

function FriendsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [searchError, setSearchError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user account data and friends in parallel
        const [userData, friendsData] = await Promise.all([
          authAPI.fetchAccount(),
          friendsAPI.getFriends(),
        ]);

        setUser(userData);
        setFriends(friendsData);
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const results = await friendsAPI.searchUsers(searchQuery.trim());
      // Filter out current user and existing friends
      const filteredResults = results.filter(
        (result) =>
          result.id !== user?.id &&
          !friends.some((friend) => friend.friend.id === result.id)
      );
      setSearchResults(filteredResults);
    } catch (err: any) {
      console.error("Search error:", err);
      setSearchError("Failed to search users");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendFriendRequest = async (email: string) => {
    try {
      await friendsAPI.sendFriendRequest({ receiver_email: email });
      // Remove the user from search results after sending request
      setSearchResults((prev) => prev.filter((user) => user.email !== email));
      alert("Friend request sent successfully!");
    } catch (err: any) {
      console.error("Send friend request error:", err);
      alert(err.message || "Failed to send friend request");
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    if (!confirm("Are you sure you want to remove this friend?")) {
      return;
    }

    try {
      await friendsAPI.removeFriend(friendId);
      setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
      alert("Friend removed successfully!");
    } catch (err: any) {
      console.error("Remove friend error:", err);
      alert(err.message || "Failed to remove friend");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading friends...</div>
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
    <>
      <AppLayout user={user} onLogout={handleLogout}>
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-8 text-center">Your Friends</h2>

          {/* Search Section */}
          <div className="mb-8">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Find New Friends</h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-blue-200 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={handleSearch}
                  disabled={searchLoading}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Search Results */}
              {searchError && (
                <p className="text-red-300 mt-4">{searchError}</p>
              )}

              {searchResults.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-3">Search Results:</h4>
                  <div className="space-y-3">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between bg-white bg-opacity-10 p-4 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{result.full_name}</p>
                          <p className="text-blue-200 text-sm">
                            {result.email}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSendFriendRequest(result.email)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Send Request
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery &&
                searchResults.length === 0 &&
                !searchLoading &&
                !searchError && (
                  <p className="text-blue-200 mt-4">No users found</p>
                )}
            </div>
          </div>

          {/* Friends List */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6">
              Your Friends ({friends.length})
            </h3>

            {friends.length === 0 ? (
              <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
                <p className="text-blue-100 text-lg">No friends yet</p>
                <p className="text-blue-200 text-sm mt-2">
                  Search for users above to send friend requests
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {friends.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">
                          {friendship.friend.full_name}
                        </h4>
                        <p className="text-blue-200 text-sm mb-2">
                          {friendship.friend.email}
                        </p>
                        <div className="flex items-center gap-4 text-blue-200 text-xs">
                          <span className="capitalize">
                            Status: {friendship.status}
                          </span>
                          <span>
                            Friends since:{" "}
                            {new Date(
                              friendship.created_at
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="ml-4 flex gap-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Send Message
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(friendship.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </AppLayout>

      {/* Navigation */}
      <ChatsNavigation
        conversationCount={0}
        friendsCount={friends.length}
        friendRequestsCount={0}
      />
    </>
  );
}

export default FriendsPage;
