import { useState } from "react";

export type TabType = "chats" | "friends" | "friend-requests";

interface DashboardFooterProps {
  conversationCount?: number;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

function DashboardFooter({
  conversationCount = 0,
  activeTab = "chats",
  onTabChange,
}: DashboardFooterProps) {
  const [currentTab, setCurrentTab] = useState<TabType>(activeTab);

  const handleTabClick = (tab: TabType) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
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
          content: "0 friends online",
          icon: "👥",
        };
      case "friend-requests":
        return {
          title: "Requests",
          content: "No pending requests",
          icon: "📨",
        };
      default:
        return { title: "", content: "", icon: "" };
    }
  };

  const tabs: TabType[] = ["chats", "friends", "friend-requests"];

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

export default DashboardFooter;
