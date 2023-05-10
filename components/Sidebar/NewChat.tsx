"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";

type Props = {
  isMobile?: boolean;
};

function NewChat({ isMobile }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const createNewChat = async () => {
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
    <>
      {isMobile ? (
        <PlusIcon
          className="cursor-pointer hover:text-neutral-400 mr-1 w-7 h-7"
          onClick={createNewChat}
        />
      ) : (
        <div
          onClick={createNewChat}
          className="flex w-full flex-shrink-0 cursor-pointer select-none items-center gap-3 rounded-md border border-white/20 p-3 text-[14px] leading-normal text-white transition-colors duration-200 hover:bg-gray-500/10"
        >
          <PlusIcon className="h-4 w-4" />
          <p>New chat</p>
        </div>
      )}
    </>
  );
}

export default NewChat;
