"use client";

import { useAtom } from "jotai";
import { FC } from "react";
import { activeChatAtom } from "../../state";
import NewChat from "../Sidebar/NewChat";

export const Navbar: FC = () => {
  const [activeChat] = useAtom(activeChatAtom);

  return (
    <nav className="flex w-full justify-between bg-gray-900 py-3 px-4 text-white">
      <div className="mr-4"></div>

      <div className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">
        {activeChat.name}
      </div>

      <NewChat isMobile={true} />
    </nav>
  );
};
