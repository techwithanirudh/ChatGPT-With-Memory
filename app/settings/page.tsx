"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const themes = [{ name: "Light" }, { name: "Dark" }];

type SelectProps = {
  options: any;
  value: any;
  onChange: any;
  className: string;
};

function Select({ options, value, onChange, className }: SelectProps) {
  return (
    <div className={className}>
      <Listbox value={value} onChange={onChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-gray-50 text-black dark:text-white dark:bg-gray-700 py-3 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-gray-300 dark:border-gray-600">
            <span className="block truncate">{value.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option: any, optionIdx: number) => (
                <Listbox.Option
                  key={optionIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-green-600 text-white"
                        : "text-gray-900 dark:text-gray-100"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

function Settings() {
  const router = useRouter();
  const { data: session } = useSession();

  const [temperature, setTemperature] = useState(0.8);
  const [apiKey, setApiKey] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(
    localStorage.getItem("theme") === "light" ? themes[0] : themes[1]
  );

  const [errors, setErrors] = useState({
    temperature: "",
    apiKey: "",
    submit: "",
  });
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (selectedTheme.name === "Dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [selectedTheme]);

  const updateSettings = async () => {
    // Validate all the fields
    if (temperature < 0 || temperature > 1) {
      setErrors({
        ...errors,
        temperature: "Temperature must be between 0 and 1",
      });

      return;
    }

    if (!apiKey.startsWith("sk-") && apiKey.length != 0) {
      setErrors({
        ...errors,
        apiKey: "Invalid API key",
      });

      return;
    }

    setErrors({
      temperature: "",
      apiKey: "",
      submit: "",
    });

    // Update the settings

    const userRef = doc(db, "users", session?.user?.email!);
    await setDoc(userRef, {
      temperature: temperature || 0.8,
      apiKey: apiKey || "",
    });

    setErrors({
      ...errors,
      submit: "Settings updated successfully",
    });
  };

  useEffect(() => {
    const getUserSettings = async () => {
      const userRef = doc(db, "users", session?.user?.email!);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setTemperature(userDoc.data()?.temperature || 0.8);
        setApiKey(userDoc.data()?.apiKey || "");
      }
    };

    if (session?.user?.email && !dataFetched) {
      getUserSettings();
      setDataFetched(true);
    }
  }, [session]);

  return (
    <div className="md:col-span-2 h-full w-full pt-4">
      <div className="h-full w-full">
        <div className="sm:overflow-hidden h-full w-full flex flex-col justify-between items-center">
          <div className="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6 w-full">
            <div>
              <p className="text-xl text-gray-900 dark:text-gray-300">
                Settings
              </p>
              <h1 className="text-3xl font-bold dark:text-white">
                Change the settings
              </h1>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="temperature"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Temperature
              </label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {temperature}
                <br />
                If you want to generate more creative responses, increase the
                temperature. If you want to generate more sensible responses,
                decrease the temperature.
              </p>

              {errors.temperature && (
                <p className="text-red-500 text-xs mt-2">
                  {errors.temperature}
                </p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label
                htmlFor="api_key"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                API Key
              </label>
              <input
                type="text"
                id="api_key"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:cursor-not-allowed"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                If you don't have an API key, you can leave this field blank. It
                will use the default API key.
              </p>

              {errors.apiKey && (
                <p className="text-red-500 text-xs mt-2">{errors.apiKey}</p>
              )}
            </div>

            <div className="col-span-6 sm:col-span-4">
              {" "}
              <label
                htmlFor="theme"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Theme
              </label>
              <Select
                options={themes}
                value={selectedTheme}
                onChange={setSelectedTheme}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                A refresh might be required for the theme selector on the Sidebar
                to update.
              </p>
            </div>
            {errors.submit && (
              <p className="text-green-100 p-2 rounded-md text-sm mt-2 bg-green-500">
                {errors.submit}
              </p>
            )}
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6 w-full flex flex-row justify-start">
            <button
              onClick={updateSettings}
              className="flex py-2 bg-green-500 px-3 items-center gap-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 relative"
            >
              <div className="flex w-full items-center justify-center gap-2">
                Save
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
