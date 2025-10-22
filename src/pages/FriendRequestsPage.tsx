import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI, type UserAccount } from "../api/auth";
import { friendsAPI, type FriendRequest } from "../api/friends";
import AppLayout from "../layouts/AppLayout";
import ChatsNavigation from "../components/ChatsNavigation";

function FriendRequestsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserAccount | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "incoming" | "outgoing" | "search"
  >("incoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
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

        // Fetch user account data and pending friend requests
        const [userData, pendingRequestsData] = await Promise.all([
          authAPI.fetchAccount(),
          friendsAPI.getPendingFriendRequests(),
        ]);

        setUser(userData);

        console.log(
          "Pending requests data:",
          pendingRequestsData,
          "Type:",
          typeof pendingRequestsData
        );

        // Ensure pendingRequestsData is an array
        const requestsArray = Array.isArray(pendingRequestsData)
          ? pendingRequestsData
          : [];

        // Separate incoming and outgoing requests based on user ID
        const incomingData = requestsArray.filter(
          (request) => request.receiver_id === userData.id
        );
        const outgoingData = requestsArray.filter(
          (request) => request.sender_id === userData.id
        );

        setIncomingRequests(incomingData);
        setOutgoingRequests(outgoingData);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(`Failed to load friend requests: ${err.message}`);

        // If token is invalid, redirect to login
        if (
          err.message?.includes("Unauthorized") ||
          err.message?.includes("401")
        ) {
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }

        // Set empty arrays so the page still renders with header/footer
        setIncomingRequests([]);
        setOutgoingRequests([]);
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

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await friendsAPI.acceptFriendRequest(requestId);
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
      alert("Friend request accepted!");
    } catch (err: any) {
      console.error("Accept request error:", err);
      alert(err.message || "Failed to accept friend request");
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      await friendsAPI.rejectFriendRequest(requestId);
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
      alert("Friend request rejected");
    } catch (err: any) {
      console.error("Reject request error:", err);
      alert(err.message || "Failed to reject friend request");
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const results = await friendsAPI.searchActiveUsers(searchQuery.trim());
      console.log("Search results:", results);

      // Filter out current user and handle friendship_status
      const filteredResults = results.filter((result) => {
        // Don't show current user
        if (result.user?.id === user?.id || result.id === user?.id) {
          return false;
        }

        // Show users based on their friendship status
        const status = result.friendship_status;
        return status === "none" || status === null || status === undefined;
      });

      setSearchResults(filteredResults);
    } catch (err: any) {
      console.error("Search error:", err);
      setSearchError(err.message || "Failed to search users");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendFriendRequest = async (email: string) => {
    try {
      await friendsAPI.sendFriendRequest({ receiver_email: email });
      // Remove the user from search results after sending request
      setSearchResults((prev) =>
        prev.filter((result) => {
          const userData = result.user || result;
          return userData.email !== email;
        })
      );
      alert("Friend request sent successfully!");
    } catch (err: any) {
      console.error("Send friend request error:", err);
      alert(err.message || "Failed to send friend request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading friend requests...</div>
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
          <h2 className="text-4xl font-bold mb-8 text-center">
            Friend Requests
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2 text-red-200">
                  Error Loading Data
                </h3>
                <p className="text-red-100 mb-3">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-1 bg-white bg-opacity-10 p-1 rounded-lg backdrop-blur-sm">
              <button
                onClick={() => setActiveTab("incoming")}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "incoming"
                    ? "bg-white bg-opacity-20 text-white"
                    : "text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                Incoming ({incomingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("outgoing")}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "outgoing"
                    ? "bg-white bg-opacity-20 text-white"
                    : "text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                Sent ({outgoingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab("search")}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === "search"
                    ? "bg-white bg-opacity-20 text-white"
                    : "text-blue-200 hover:text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                Find Users
              </button>
            </div>
          </div>

          {/* Content Based on Active Tab */}
          <div className="mb-12">
            {activeTab === "search" ? (
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Find Active Users
                </h3>

                {/* Search Input */}
                <div className="mb-6">
                  <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Search active users..."
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

                    {/* Search Error */}
                    {searchError && (
                      <p className="text-red-300 mt-4">{searchError}</p>
                    )}
                  </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 ? (
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Search Results ({searchResults.length}):
                    </h4>
                    <div className="grid gap-4">
                      {searchResults.map((result) => {
                        const userData = result.user || result;
                        const friendshipStatus = result.friendship_status;

                        return (
                          <div
                            key={userData.id}
                            className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-xl font-semibold mb-2">
                                  {userData.name ||
                                    userData.full_name ||
                                    `${userData.first_name || ""} ${
                                      userData.last_name || ""
                                    }`.trim()}
                                </h4>
                                <p className="text-blue-200 text-sm mb-2">
                                  {userData.email}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  {userData.status_id === 1 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 bg-opacity-20 text-green-300">
                                      Active
                                    </span>
                                  )}
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 bg-opacity-20 text-blue-300">
                                    {friendshipStatus === "none" ||
                                    !friendshipStatus
                                      ? "No connection"
                                      : `Status: ${friendshipStatus}`}
                                  </span>
                                  {userData.created_at && (
                                    <span className="text-blue-300 text-xs">
                                      Joined:{" "}
                                      {new Date(
                                        userData.created_at
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <button
                                  onClick={() =>
                                    handleSendFriendRequest(userData.email)
                                  }
                                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                >
                                  Send Request
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : searchQuery && !searchLoading && !searchError ? (
                  <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
                    <p className="text-blue-100 text-lg">No users found</p>
                    <p className="text-blue-200 text-sm mt-2">
                      Try searching with different terms
                    </p>
                  </div>
                ) : !searchQuery ? (
                  <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
                    <p className="text-blue-100 text-lg">
                      Search for Active Users
                    </p>
                    <p className="text-blue-200 text-sm mt-2">
                      Enter a search term to find users you can send friend
                      requests to
                    </p>
                  </div>
                ) : null}
              </div>
            ) : activeTab === "incoming" ? (
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Incoming Requests ({incomingRequests.length})
                </h3>

                {incomingRequests.length === 0 ? (
                  <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
                    <p className="text-blue-100 text-lg">
                      No incoming requests
                    </p>
                    <p className="text-blue-200 text-sm mt-2">
                      Friend requests from others will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {incomingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm hover:bg-opacity-20 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold mb-2">
                              {request.sender.full_name}
                            </h4>
                            <p className="text-blue-200 text-sm mb-2">
                              {request.sender.email}
                            </p>
                            <div className="flex items-center gap-4 text-blue-200 text-xs">
                              <span className="capitalize">
                                Status: {request.status}
                              </span>
                              <span>
                                Received:{" "}
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="ml-4 flex gap-2">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Sent Requests ({outgoingRequests.length})
                </h3>

                {outgoingRequests.length === 0 ? (
                  <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm text-center">
                    <p className="text-blue-100 text-lg">No sent requests</p>
                    <p className="text-blue-200 text-sm mt-2">
                      Friend requests you've sent will appear here
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {outgoingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold mb-2">
                              {request.receiver?.full_name || "Unknown User"}
                            </h4>
                            <p className="text-blue-200 text-sm mb-2">
                              {request.receiver?.email || "No email available"}
                            </p>
                            <div className="flex items-center gap-4 text-blue-200 text-xs">
                              <span className="capitalize">
                                Status: {request.status}
                              </span>
                              <span>
                                Sent:{" "}
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="ml-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                request.status === "pending"
                                  ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                                  : request.status === "accepted"
                                  ? "bg-green-500 bg-opacity-20 text-green-300"
                                  : "bg-red-500 bg-opacity-20 text-red-300"
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </AppLayout>

      {/* Navigation */}
      <ChatsNavigation
        conversationCount={0}
        friendsCount={0}
        friendRequestsCount={incomingRequests.length + outgoingRequests.length}
      />
    </>
  );
}

export default FriendRequestsPage;
