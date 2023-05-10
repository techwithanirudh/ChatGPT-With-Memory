"use client";

import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { collection, DocumentData, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { Key, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import Message from "./ChatMessage";
import ScrollToBottom, {
  FunctionContext,
  StateContext,
} from "react-scroll-to-bottom";
import { Fragment } from "react";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

import { useAtom } from "jotai";
import { messageAtom } from "../../state";

// Import function context

type Props = {
  scrollToBottom: any;
  sticky: boolean;
  chatId: string;
};

function Chat({ scrollToBottom, sticky, chatId }: Props) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [, setPrompt] = useAtom(messageAtom);

  var messages: any = { empty: true, docs: [] };
  if (chatId) {
    var [messages]: any = useCollection(
      session &&
        query(
          collection(
            db,
            "users",
            session?.user?.email!,
            "chats",
            chatId,
            "messages"
          ),
          orderBy("createdAt", "asc")
        )
    );
  }

  useEffect(() => {
    // Check when user message is only there but no response from the bot
    if (messages?.docs.length > 0) {
      var lastMessage = messages?.docs[messages?.docs.length - 1];
      lastMessage = lastMessage.data();
      console.log(lastMessage);
      if (lastMessage) {
        var isChatGPT = lastMessage.user.name === "ChatGPT";

        if (!isChatGPT) {
          setIsLoading(true);
        } else {
          setIsLoading(false);
        }
      }
    }
  }, [messages]);

  return (
    <Fragment>
      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
        {messages?.empty && (
          <>
            <div className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
              {session?.user?.image === "ADMIN" ? (
                <h1 className="text-2xl font-semibold text-center mt-6 sm:mt-[15vh] ml-auto mr-auto flex gap-2 items-center justify-center">
                  TechWithAnirudh ChatGPT | Viewing {session?.user?.email}'s
                  Chats
                </h1>
              ) : (
                <h1 className="text-4xl font-semibold text-center mt-6 sm:mt-[15vh] ml-auto mr-auto flex gap-2 items-center justify-center">
                  TechWithAnirudh ChatGPT
                </h1>
              )}
              <div className="mb-10 sm:mb-16 mt-4  text-black/50 dark:text-white/50">
                Huge thanks for{" "}
                <a
                  href="https://replit.com/@CharCoder"
                  className="text-black/100 dark:text-white/100 hover:text-black/70 dark:hover:text-white/70"
                >
                  @CharCoder
                </a>{" "}
                for keeping this app alive by donating their OpenAI API key!
                Without their donation, this app would have been shut down.
              </div>
              <div className="md:flex items-start text-center gap-3.5">
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-[9px] items-center m-auto text-lg font-normal md:flex-col md:gap-[5px]">
                    <SunIcon className="h-7 w-7" />
                    Examples
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <button
                      className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                      onClick={() =>
                        setPrompt("Explain quantum computing in simple terms")
                      }
                    >
                      "Explain quantum computing in simple terms" →
                    </button>
                    <button
                      className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                      onClick={() =>
                        setPrompt(
                          "Got any creative ideas for a 10 year old’s birthday?"
                        )
                      }
                    >
                      "Got any creative ideas for a 10 year old’s birthday?" →
                    </button>
                    <button
                      className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                      onClick={() =>
                        setPrompt(
                          "How do I make an HTTP request in Javascript?"
                        )
                      }
                    >
                      "How do I make an HTTP request in Javascript?" →
                    </button>
                  </ul>
                </div>
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                    <BoltIcon className="h-6 w-6" />
                    Capabilities
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                      Remembers what user said earlier in the conversation
                    </li>
                    <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                      Allows user to provide follow-up corrections
                    </li>
                    <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                      Trained to decline inappropriate requests
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                  <h2 className="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2">
                    <ExclamationTriangleIcon className="h-6 w-6" />
                    Limitations
                  </h2>
                  <ul className="flex flex-col gap-3.5 w-full sm:max-w-md m-auto">
                    <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                      May occasionally generate incorrect information
                    </li>
                    <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                      May occasionally produce harmful instructions or biased
                      content
                    </li>
                    <li className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                      Limited knowledge of world and events after 2021
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
        {messages?.docs.map(
          (doc: { id: Key | null | undefined; data: () => DocumentData }) => (
            // Check if this is the last message
            <>
              {messages?.docs[messages?.docs.length - 1].id === doc.id ? (
                <Message
                  key={doc.id}
                  message={doc.data()}
                  loading={isLoading}
                  data={{
                    session: session,
                    chatId: chatId,
                    messageId: doc.id,
                  }}
                />
              ) : (
                <Message
                  key={doc.id}
                  message={doc.data()}
                  loading={false}
                  data={{
                    session: session,
                    chatId: chatId,
                    messageId: doc.id,
                  }}
                />
              )}
            </>
          )
        )}{" "}
        <div className="w-full h-48 flex-shrink-0"></div>
        {!sticky && (
          <button
            className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 p-1"
            onClick={scrollToBottom}
          >
            <ArrowDownIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </Fragment>
  );
}

export default ({ chatId }: any) => (
  <ScrollToBottom
    className="max-h-full overflow-x-hidden dark:bg-gray-800 bg-white"
    followButtonClassName="scroll-convo"
  >
    <FunctionContext.Consumer>
      {({ scrollToBottom }: any) => (
        <StateContext.Consumer>
          {({ sticky }: any) => (
            <Chat
              scrollToBottom={scrollToBottom}
              sticky={sticky}
              chatId={chatId}
            />
          )}
        </StateContext.Consumer>
      )}
    </FunctionContext.Consumer>
  </ScrollToBottom>
);
