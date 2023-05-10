import Chat from "../../../components/Chat/Chat";
import ChatInput from "../../../components/Chat/ChatInput";
type Props = {
  params: {
    id: string;
  };
};

function ChatPage({ params: { id } }: Props) {
  return (
    <div className="relative flex-1 overflow-hidden bg-white dark:bg-gray-800">
      <Chat chatId={id} />

      <ChatInput chatId={id} />
    </div>
  );
}

export default ChatPage;
