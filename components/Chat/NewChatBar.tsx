"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";

function  NewChatBar() {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const doc = await addDoc(
      collection(db, "users", session?.user?.email!, "chats"),
      {
        userId: session?.user?.email,
        createdAt: serverTimestamp(),
      }
    );

    router.push(`/chat/${doc.id}`);
  };

  return (
    <div className="absolute bottom-0 left-0 w-full dark:border-white/20 border-transparent dark:bg-gray-800 dark:bg-gradient-to-t from-gray-800 via-gray-800 to-gray-800/0 bg-white dark:!bg-transparent dark:bg-vert-dark-gradient pt-6 md:pt-2">
      <form
        className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6"
        onSubmit={createNewChat}
        style={{
          flexDirection: "column",
          gap: "0px",
          marginBottom: "0.5em",
        }}
      >
        <div className="relative flex h-full flex-1 flex-col md:flex-col">
          <div className="flex ml-1 mt-1.5 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center"></div>
          <div className="flex flex-col w-full flex-grow relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
            <button
              type="submit"
              className="flex py-3 px-3 items-center gap-3 rounded-md bg-gray-500/10 transition-colors duration-200  cursor-pointer text-sm flex-shrink-0 border border-white/20"
            >
              <PlusIcon className="h-4 w-4" />
              <p>New chat</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewChatBar;
