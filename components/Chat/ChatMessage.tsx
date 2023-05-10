import { doc, DocumentData, updateDoc } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import { useRef, useEffect, useState, memo } from "react";
import { db } from "../../firebase";
import { CodeBlock } from "../Markdown/CodeBlock";

type Props = {
  message: DocumentData;
  loading: boolean;
  data: any;
};

function Message({ message, loading, data }: Props) {
  const isChatGPT = message.user.name === "ChatGPT";

  function handleRating(value: number) {
    toast.success("Thanks for your feedback!");

    // A message is

    // Data.session, data.chatId
    console.log(data.session?.user?.email!, data.chatId, data.messageId);
    const docRef = doc(
      db,
      "users",
      data.session?.user?.email!,
      "chats",
      data.chatId,
      "messages",
      data.messageId
    );

    // console.log(docRef);
    updateDoc(docRef, {
      rating: value,
    });
  }

  return (
    <div
      className={`w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group ${
        isChatGPT ? "bg-gray-50 dark:bg-gray-1000" : "dark:bg-gray-800"
      } ${loading ? "usermessagewaiting" : ""}`}
      style={{ overflowWrap: "anywhere" }}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        <img
          src={message.user.avatar}
          alt={message.user.name}
          className="rounded-sm w-8 h-8 bg-blue-800"
        />

        <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
          <div className="flex flex-grow flex-col gap-3">
            <div className="min-h-[20px] flex flex-col items-start gap-4">
              <div className="markdown prose w-full break-words dark:prose-invert dark">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <CodeBlock
                          key={Math.random()}
                          language={match[1]}
                          value={String(children).replace(/\n$/, "")}
                          lightMode={"dark"}
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    table({ children }) {
                      return (
                        <table className="border-collapse border border-black dark:border-white py-1 px-3 rounded-md">
                          {children}
                        </table>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="border border-black dark:border-white break-words py-1 px-3 bg-gray-500 text-white">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="border border-black dark:border-white break-words py-1 px-3">
                          {children}
                        </td>
                      );
                    },
                  }}
                >
                  {message.withoutSearchQuery || message.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {isChatGPT && (
          <div className="flex justify-between">
            <div className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
              <button
                className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                onClick={() => handleRating(1)}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>
              <button
                className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                onClick={() => handleRating(-1)}
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message;
