import { DocumentData, query } from "firebase/firestore";
import { collection, deleteDoc, doc, orderBy } from "firebase/firestore";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { activeChatAtom } from "../../state";
import { database } from "firebase-admin";

type Props = {
  id: string;
  data: any;
};

function TrashIcon({ className }: any) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  );
}

function ChatBubbleOvalLeftIcon({ className }: any) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function ChatRow({ id, data }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [activeChat, setActiveChat] = useAtom(activeChatAtom);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    if (pathname.includes(id)) {
      setActiveChat({
        id,
        name: data.name,
      });
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [pathname]);

  const removeChat = async () => {
    // Delete the chat
    await deleteDoc(doc(db, "users", session?.user?.email!, "chats", id));
    router.replace("/");
  };

  return (
    <Link
      href={`/chat/${id}`}
      className={`flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 hover:bg-gray-800 group ${
        isActive && "bg-gray-800 hover:bg-gray-800"
      }`}
    >
      <ChatBubbleOvalLeftIcon className="h-4 w-4" />
      <p className="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
        {data.name}
      </p>
      <div className="absolute flex right-1 text-gray-300 visible">
        <button className="p-1 hover:text-white" onClick={removeChat}>
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </Link>
  );
}

export default ChatRow;
