import Chat from "../components/Chat/Chat";
import NewChatBar from "../components/Chat/NewChatBar";

function HomePage() {
  return (
    <div className="relative flex-1 overflow-hidden bg-white dark:bg-gray-800">
      <Chat chatId={null} />

      <NewChatBar />
    </div>
  );
}

export default HomePage;
