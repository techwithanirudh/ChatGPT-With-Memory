// @ts-nocheck
"use client";

import { useSession } from "next-auth/react";
import NewChat from "./NewChat";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import ChatRow from "../Chat/ChatRow";
import ModelSelection from "./ModelSelection";
import { MoonIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArchiveBoxXMarkIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { SidebarButton } from "./SidebarButton";
import { ClearConversations } from "./ClearConversations";
import { Tooltip } from "react-tooltip";
import Search from "./Search";

function Cog6ToothIcon({ className }: any) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

function SunIcon({ className }: any) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      height="1.2rem"
      width="1.2rem"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function SideBar() {
  const { data: session } = useSession();
  const [originalChats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session?.user?.email!, "chats"),
        orderBy("createdAt", "desc")
      )
  );
  const [chats, setChats] = useState(null);
  const [filteredChats, setFilteredChats] = useState([]);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPanel, setShowPanel] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);

  async function clearAll() {
    originalChats?.docs.forEach(async (chat: any) => {
      await deleteDoc(
        doc(db, "users", session?.user?.email!, "chats", chat.id)
      );
    });
  }

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      setIsLightTheme(true);
    } else {
      setIsLightTheme(false);
    }
  }, []);

  useEffect(() => {
    if (isLightTheme) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightTheme]);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }

    const showChatbar = localStorage.getItem("showSidebar");
    if (showChatbar) {
      setShowSidebar(showChatbar === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("showSidebar", showSidebar.toString());
  }, [showSidebar]);

  async function getChatsWithNames() {
    let fltChats = [];

    for (const chat of originalChats?.docs) {
      const messages = await getDocs(
        query(
          collection(
            db,
            "users",
            session?.user?.email!,
            "chats",
            chat.id,
            "messages"
          ),
          orderBy("createdAt", "asc")
        )
      );

      const title =
        messages.docs[messages.docs.length - 1]?.data().text || "New Chat";
      fltChats.push({ id: chat.id, data: { name: title } });
    }

    return fltChats;
  }

  useEffect(() => {
    async function handlePopulateChats() {
      if (originalChats?.docs) {
        let fltChats = await getChatsWithNames();

        setChats(fltChats);
      }
    }

    handlePopulateChats();
  }, [originalChats]);

  useEffect(() => {
    if (chats != null) {
      setFilteredChats(chats);
      setLoadingChats(false);
    }
  }, [chats]);

  function handleToggleChatbar() {
    setShowSidebar(!showSidebar);
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value);

    if (value) {
      const filtered = chats.filter((chat: any) =>
        chat.data.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredChats(filtered);
    } else {
      setFilteredChats(chats);
    }
  }

  return (
    <>
      {showSidebar ? (
        <>
          <div
            className={`fixed top-0 bottom-0 z-50 flex h-full w-[260px] flex-none flex-col space-y-2 p-2 transition-all sm:relative sm:top-0 bg-gray-900 dark`}
          >
            {/* NewChat  */}
            <div className="flex items-center">
              <NewChat />

              <Bars3Icon
                className="ml-1 hidden cursor-pointer p-1 text-neutral-300 hover:text-neutral-400 sm:flex h-7 w-7"
                onClick={handleToggleChatbar}
              />
            </div>

            <div>
              <ModelSelection />
            </div>

            {originalChats?.docs.length > 0 && (
              <Search
                placeholder="Search..."
                searchTerm={searchTerm}
                onSearch={handleSearchChange}
              />
            )}

            <div className="flex-grow overflow-auto p-1">
              <div className="flex flex-col gap-2 text-gray-100 text-sm -ml-[5px]">
                {/* Map through the ChatRows */}
                {loadingChats && (
                  <div className="animate-pulse text-center text-white">
                    Loading Chats...
                  </div>
                )}
                {/* Check if chats are empty */}
                {filteredChats?.length === 0 && !loadingChats && (
                  <div className="text-center text-gray-400 flex items-center justify-center space-x-1 flex-col">
                    <ArchiveBoxXMarkIcon className="w-12 h-12" />
                    No chats yet. Start a new chat!
                  </div>
                )}

                {filteredChats?.map((chat: any) => (
                  <ChatRow key={chat.id} id={chat.id} data={chat.data} />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
              {showPanel ? (
                <>
                  <button
                    className="flex w-full cursor-pointer select-none items-center rounded-md py-0.5 justify-center px-3 text-white transition-colors duration-200 bg-gray-500/20 hover:bg-gray-500/30"
                    onClick={() => setShowPanel(false)}
                    data-tooltip-id="minimize-tooltip"
                    data-tooltip-content="Hide Panel"
                  >
                    <ChevronDownIcon className="w-[17.5px] h-[17.5px]" />
                    {/* Hide Panel */}
                  </button>
                  <Tooltip
                    id="minimize-tooltip"
                    place="right"
                    style={{
                      paddingInline: "0.5em",
                      paddingBlock: "0.25em",
                      borderRadius: "0.5em",
                      boxShadow: "0 0 10px rgba(0,0,0,0.25)",
                    }}
                  />

                  <ClearConversations onClearConversations={clearAll} />

                  <SidebarButton
                    icon={<Cog6ToothIcon className="w-4 h-4" />}
                    text={"Settings"}
                    as={Link}
                    href="/settings"
                  />

                  <button
                    className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
                    onClick={() => setIsLightTheme(!isLightTheme)}
                  >
                    {!isLightTheme ? (
                      <>
                        <SunIcon className="w-[1.2rem] h-[1.2rem] -ml-[1.8px]" />
                        <p className="-ml-[1.8px]">Light Mode</p>
                      </>
                    ) : (
                      <>
                        <MoonIcon className="w-[17.5px] h-[17.5px]" />
                        Dark Mode
                      </>
                    )}
                  </button>

                  {session && session?.user?.image != "ADMIN" && (
                    <SidebarButton
                      icon={
                        <img
                          alt="Profile Pic"
                          src={session?.user?.image!}
                          className="h-6 w-6 rounded-full"
                        />
                      }
                      text={"My Account"}
                      as={Link}
                      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 bg-gray-500/20 hover:bg-gray-500/30"
                      href="/profile"
                    />
                  )}

                  {session?.user?.image === "ADMIN" && (
                    <button className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10">
                      Admin, You are viewing {session?.user?.email}'s chats
                    </button>
                  )}
                </>
              ) : (
                <button
                  className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 bg-gray-500/20 hover:bg-gray-500/30"
                  onClick={() => setShowPanel(true)}
                >
                  <ChevronUpIcon className="w-[17.5px] h-[17.5px]" />
                  Show panel
                </button>
              )}
            </div>
          </div>

          <button
            className="fixed top-2.5 md:top-3.5 left-[270px] z-50 h-7 w-7 hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:top-0.5 sm:left-[270px] sm:h-8 sm:w-8 sm:text-neutral-700"
            onClick={handleToggleChatbar}
          >
            <XMarkIcon />
          </button>

          <div
            onClick={handleToggleChatbar}
            className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
          ></div>
        </>
      ) : (
        <button
          className="fixed top-2.5 md:top-3.5 left-4 z-50 h-7 w-7 text-white hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:top-0.5 sm:left-4 sm:h-8 sm:w-8 sm:text-neutral-700"
          onClick={handleToggleChatbar}
        >
          <Bars3Icon />
        </button>
      )}
    </>
  );
}

export default SideBar;
