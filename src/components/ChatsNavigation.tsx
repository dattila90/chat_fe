import { useNavigate, useLocation } from "react-router-dom";

export type TabType = "chats" | "friends" | "friend-requests";

interface ChatsNavigationProps {
  conversationCount?: number;
  friendsCount?: number;
  friendRequestsCount?: number;
}

function ChatsNavigation({
  conversationCount = 0,
  friendsCount = 0,
  friendRequestsCount = 0,
}: ChatsNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = (): TabType => {
    const path = location.pathname;
    if (path === "/friends") return "friends";
    if (path === "/friend-requests") return "friend-requests";
    return "chats";
  };

  const handleTabClick = (tab: TabType) => {
    switch (tab) {
      case "chats":
        navigate("/chats");
        break;
      case "friends":
        navigate("/friends");
        break;
      case "friend-requests":
        navigate("/friend-requests");
        break;
    }
  };

  const getTabContent = (tab: TabType) => {
    switch (tab) {
      case "chats":
        return {
          title: "Chats",
          content:
            conversationCount === 0
              ? "No conversations"
              : `${conversationCount} conversation${
                  conversationCount !== 1 ? "s" : ""
                }`,
          icon: "💬",
        };
      case "friends":
        return {
          title: "Friends",
          content:
            friendsCount === 0
              ? "No friends"
              : `${friendsCount} friend${friendsCount !== 1 ? "s" : ""}`,
          icon: "👥",
        };
      case "friend-requests":
        return {
          title: "Requests",
          content:
            friendRequestsCount === 0
              ? "No requests"
              : `${friendRequestsCount} request${
                  friendRequestsCount !== 1 ? "s" : ""
                }`,
          icon: "📨",
        };
      default:
        return { title: "", content: "", icon: "" };
    }
  };

  const tabs: TabType[] = ["chats", "friends", "friend-requests"];
  const currentTab = getCurrentTab();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-sm border-t border-white border-opacity-20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const tabContent = getTabContent(tab);
            const isActive = currentTab === tab;

            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`p-3 rounded-lg transition-all text-center ${
                  isActive
                    ? "bg-white bg-opacity-20 text-white shadow-lg"
                    : "bg-white bg-opacity-5 text-blue-100 hover:bg-opacity-15 hover:text-white"
                }`}
              >
                <div className="text-lg mb-1">{tabContent.icon}</div>
                <h3 className="text-sm font-semibold mb-1">
                  {tabContent.title}
                </h3>
                <p className="text-xs opacity-80">{tabContent.content}</p>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

export default ChatsNavigation;
