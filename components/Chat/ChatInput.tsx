"use client";

import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { useSession } from "next-auth/react";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { db } from "../../firebase";
import toast, { LoaderIcon } from "react-hot-toast";
import ModelSelection from "../Sidebar/ModelSelection";
import useSWR from "swr";
import TextareaAutosize from "react-textarea-autosize";
import { apiSearch } from "../../lib/search/search";
import { Switch } from "@headlessui/react";

import { Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { useAtom } from "jotai";
import { messageAtom } from "../../state";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import ReactDOMServer from "react-dom/server";
import { Message } from "../../typings";

type Props = {
  chatId: string;
};

async function getPrompts() {
  // Fetch /api/prompts
  // Return the prompts

  const res = await fetch("/api/prompts");
  let prompts = await res.json();
  prompts = JSON.parse(prompts);
  let promptsArray: any = [];

  for (var i = 0; i < prompts.length; i++) {
    promptsArray.push({
      id: i,
      name: prompts[i].act,
      prompt: prompts[i].prompt,
    });
  }

  return promptsArray;
}

function ChatInput({ chatId }: Props) {
  const [prompt, setPrompt] = useAtom(messageAtom);
  const { data: session } = useSession();
  const [webSearch, setWebSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: model } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo",
  });

  const [customPrompts, setCustomPrompts] = useState([
    {
      id: 0,
      name: "",
      prompt: "",
    },
  ]);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    async function fetchAPIPrompts() {
      const initialPrompts = await getPrompts();
      console.log(initialPrompts);
      setCustomPrompts(initialPrompts);
    }
    fetchAPIPrompts();
  }, []);

  const [selected, setSelected] = useState(customPrompts[0]);
  const [selectedChanges, setSelectedChanges] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const filteredPeople =
    prompt === ""
      ? customPrompts
      : customPrompts.filter((customPrompt: { name: string }) =>
          customPrompt.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/\//g, "")
            .includes(
              prompt.toLowerCase().replace(/\s+/g, "").replace(/\//g, "")
            )
        );

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!prompt) return;

    var orgPrompt = prompt.trim();
    setPrompt("");
    setIsLoading(true);

    var input;

    if (webSearch) {
      const notification = toast.loading(
        "ChatGPT is getting web search results..."
      );
      var responses = await apiSearch(orgPrompt, 9);
      var searchResults: string = "";

      // The responses will be like this:
      // [0: { body: "", href: "", title: ""}, 1: { body: "", href: "", title: ""}, ...]
      // Format them into a message and send them to the chat like:
      // [1] "{body}"
      // URL: {href}

      if (responses.length > 0) {
        for (var i = 0; i < responses.length; i++) {
          searchResults += `[${i + 1}] "${responses[i].body}"\nURL: ${
            responses[i].href
          }\n\n`;
        }
      } else {
        searchResults = "No results found.";
      }

      input = `Web search results:
${searchResults}

Current date: ${new Date().toLocaleDateString()}

Instructions: Using the provided web search results, write a comprehensive reply to the given query. Make sure to cite results using [[number](URL)] notation after the reference. If the provided search results refer to multiple subjects with the same name, write separate answers for each subject.

Query: ${prompt}
    `;

      toast.success("Results received!", {
        id: notification,
      });
    } else {
      input = orgPrompt;
    }

    const message: Message = {
      text: input,
      withoutSearchQuery: webSearch ? orgPrompt : "",
      createdAt: serverTimestamp(),
      user: {
        _id: session?.user?.email!,
        name: session?.user?.name!,
        avatar:
          session?.user?.image! ||
          "https://ui-avatars.com/api/?name=" + session?.user?.name!,
      },
    };

    await addDoc(
      collection(
        db,
        "users",
        session?.user?.email!,
        "chats",
        chatId,
        "messages"
      ),
      message
    );

    // Toast notification to say loading
    const notification = toast.loading("ChatGPT is thinking...");

    await fetch("/api/askQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: input,
        chatId,
        model,
        session,
      }),
    }).then(() => {
      // Toast notification to say successful!
      toast.success("ChatGPT has responded!", {
        id: notification,
      });

      setIsLoading(false);
    });
  };

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode == 13 && e.shiftKey == false && !isOpen) {
      e.preventDefault();
      sendMessage({
        preventDefault: () => {},
      } as any);
    }
  }

  useEffect(() => {
    if (prompt.startsWith("/")) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [prompt]);

  useEffect(() => {
    if (selected && selected.prompt) {
      setPrompt(selected.prompt);
    }
  }, [selectedChanges]);

  return (
    <div className="absolute bottom-0 left-0 w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 dark:border-white/20 dark:via-gray-800 dark:to-gray-800 md:pt-2 text-black dark:text-white">
     <form
        className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6"
        onSubmit={sendMessage}
        style={{
          flexDirection: "column",
          gap: "0px",
          marginBottom: "0.5em",
        }}
      >
        <div className="relative flex h-full flex-1 flex-col md:flex-col">
          <div className="flex flex-col w-full py-2 flex-grow pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
            {/* <TextareaAutosize
              className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"
              tabIndex={0}
              minRows={1}
              maxRows={5}
              onKeyDown={onKeyDown}
              style={{
                overflowY: "hidden",
              }}
              disabled={!session}
              placeholder="Type your message here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            /> */}

            {/* <button
              className="absolute p-1 rounded-md text-gray-500 dark:text-white/50 bottom-[5.5px] left-0.5 md:left-1  dark:hover:text-gray-400 disabled:cursor-not-allowed"
              onClick={() => {
                alert("Code was very buggy, so I removed it for now. Sorry!");
              }}
              type="button"
              data-tooltip-id="voice-tooltip"
              data-tooltip-content="Start Recording"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="512"
                height="512"
                className="h-6 w-6"
                viewBox="0 0 512 512"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M192 448h128m64-240v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32m128 160v80"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="32"
                  d="M256 64a63.68 63.68 0 0 0-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64Z"
                />
              </svg>
            </button> */}
            <Tooltip
              id="voice-tooltip"
              place="top"
              style={{
                paddingInline: "0.5em",
                paddingBlock: "0.25em",
                borderRadius: "0.5em",
                boxShadow: "0 0 10px rgba(0,0,0,0.25)",
              }}
            />

            <div className="m-0 w-full resize-none border-0 bg-transparent dark:bg-transparent pl-1 md:pl-2">
              <Combobox
                value={selected}
                onChange={(value: any) => {
                  setSelectedChanges(selectedChanges + 1);
                  setSelected(value);
                }}
              >
                <div className="relative mt-1 focus:ring-0 focus:outline-none">
                  <div
                    className="relative w-full cursor-default overflow-hidden bg-transparent text-left focus:outline-none sm:text-sm focus:ring-0"
                    style={{
                      lineHeight: "1.25rem",
                    }}
                  >
                    {!session || isLoading ? (
                      <p className="w-full border-none text-base md:text-[16px] leading-5 bg-transparent text-gray-600 dark:text-white/40 pb-1.5 focus:ring-0 focus:outline-none">
                        Loading...
                      </p>
                    ) : (
                      <Combobox.Input
                        className="w-full border-none text-base md:text-[16px] leading-5 bg-transparent text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                        as={TextareaAutosize}
                        // Set char limit to 1000
                        maxLength={4000}
                        // Show live character count
                        onKeyUp={(e) => {
                          setCharCount(e.currentTarget.value.length);
                        }}
                        tabIndex={0}
                        minRows={1}
                        maxRows={5}
                        onKeyDown={onKeyDown}
												placeholder={!session || isLoading ? "Loading..." : "Press / to search for a prompt"}
                        value={prompt}
                        displayValue={() => prompt}
                        onChange={(e) => {
                          setPrompt(e.target.value);
                        }}
                      />
                    )}
                  </div>
                  {isOpen && (
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                      afterLeave={() => setPrompt(prompt.replace("/", ""))}
                    >
                      <Combobox.Options className="absolute -top-48 mt-1 max-h-40 w-[102%] -left-[15px] overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg focus:outline-none focus:ring-0 sm:text-sm z-40">
                        {filteredPeople.length === 0 && prompt !== "" ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-100">
                            Nothing found.
                          </div>
                        ) : (
                          filteredPeople.map(
                            (person: {
                              id: Key | null | undefined;
                              name:
                                | string
                                | number
                                | boolean
                                | ReactElement<
                                    any,
                                    string | JSXElementConstructor<any>
                                  >
                                | ReactFragment
                                | ReactPortal
                                | null
                                | undefined;
                            }) => (
                              <Combobox.Option
                                key={person.id}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-green-600 text-white"
                                      : "text-gray-900 dark:text-gray-100"
                                  }`
                                }
                                value={person}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {person.name}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active
                                            ? "text-white"
                                            : "text-teal-600"
                                        }`}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            )
                          )
                        )}
                      </Combobox.Options>
                    </Transition>
                  )}
                </div>
              </Combobox>
            </div>

            <button
              type="submit"
              disabled={!prompt || !session}
              className={`absolute py-1 px-1 rounded-md text-gray-500 bottom-[5px] right-1 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:cursor-not-allowed`}
              data-tooltip-id="submit-tooltip"
              data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                <div className="py-0.5">
                  Send{" "}
                  <kbd className="ml-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 text-gray-800 rounded-md px-1.5 py-0.5">
                    Enter
                  </kbd>
                </div>
              )}
            >
              {!session || isLoading ? (
                // Spinner
                <div className="h-6 w-6 animate-spin rounded-full border-t-2 border-gray-600 dark:border-gray-300 hover:border-gray-500 dark:hover:border-gray-200 opacity-60"></div>
              ) : (
                <PaperAirplaneIcon className="w-6 h-6" />
              )}
            </button>

            <Tooltip
              id="submit-tooltip"
              place="top"
              style={{
                paddingInline: "0.5em",
                paddingBlock: "0.25em",
                borderRadius: "0.5em",
                boxShadow: "0 0 10px rgba(0,0,0,0.25)",
              }}
            />
          </div>
          <div className="flex ml-1 mt-1.5 md:w-full md:m-auto md:mt-2 gap-0 md:gap-2 justify-between px-0 sm:px-2 pb-0.5">
            {/* A web search toggle */}

            <div>
              <Switch.Group>
                <div className="flex items-center">
                  <Switch
                    checked={webSearch}
                    onChange={setWebSearch}
                    className={`${
                      webSearch ? "bg-green-800" : "bg-gray-600"
                    } relative inline-flex h-5 w-[38px] items-center rounded-full`}
                  >
                    <span
                      className={`${
                        webSearch ? "translate-x-5" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                  <Switch.Label className="ml-2 text-sm font-semibold dark:text-white">
                    Web search
                  </Switch.Label>
                </div>
              </Switch.Group>
            </div>
            {/* <button
              className="underline cursor-pointer text-gray-500 dark:text-gray-400 text-sm"
              type="button"
            >
              View features list
            </button> */}

            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                {charCount}/4000
              </span>
            </div>
          </div>
          <p className="text-center text-xs text-black/50 dark:text-white/50">
            AI Model by{" "}
            <a
              href="https://openai.com/"
              target="_blank"
              rel="noopener"
              className="text-black/100 dark:text-white/100 hover:text-black/70 dark:hover:text-white/70"
            >
              OpenAI
            </a>
            . API Key Provided by{" "}
            <a
              href="https://replit.com/@CharCoder"
              target="_blank"
              rel="noopener"
              className="text-black/100 dark:text-white/100 hover:text-black/70 dark:hover:text-white/70"
            >
              @CharCoder
            </a>
            . Prompts by{" "}
            <a
              href="https://github.com/f/awesome-chatgpt-prompts"
              target="_blank"
              rel="noopener"
              className="text-black/100 dark:text-white/100 hover:text-black/70 dark:hover:text-white/70"
            >
              awesome-chatgpt-prompts
            </a>
            . Built by{" "}
            <a
              href="https://replit.com/@techwithanirudh"
              target="_blank"
              rel="noopener"
              className="text-black/100 dark:text-white/100 hover:text-black/70 dark:hover:text-white/70"
            >
              @techwithanirudh
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;
