"use client";
import React, { useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Login from "../../components/Auth/Login";

export default function Profile() {
  const { data: session } = useSession();

  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");

    try {
      await signOut();
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <div className="md:col-span-2 h-full w-full  pt-4">
        {session ? (
          <form
            method="POST"
            encType="multipart/form-data"
            className="h-full w-full"
          >
            <div className="sm:overflow-hidden h-full w-full flex flex-col justify-between items-center">
              <div className="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6 w-full">
                <div>
                  <p className="text-xl text-gray-900 dark:text-gray-300">
                    Profile
                  </p>
                  <h1 className="text-3xl font-bold dark:text-white">
                    View Information
                  </h1>
                </div>
                {error && (
                  <div className="rounded-xl shadow-sm text-white bg-red-500 px-2 py-3">
                    {error}
                  </div>
                )}
                <div className="flex align-start items-center flex-col sm:flex-row">
                  <img
                    className="rounded-full w-[125px] h-[125px]"
                    src={session?.user?.image!}
                    title={session?.user?.image!}
                    alt={session?.user?.image!}
                  />
                  <div className="p-5">
                    <h2 className="text-4xl sm:text-left text-center dark:text-white font-bold">
                      {session?.user?.name!}
                    </h2>
                    <p className="text-gray-600 sm:text-left text-center dark:text-gray-300">
                      {session?.user?.email!}
                    </p>
                  </div>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    readOnly
                    disabled
                    value={session?.user?.name!}
                    className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email address*
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    readOnly
                    disabled
                    value={session?.user?.email!}
                    className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6 w-full flex flex-row justify-start">
                <button
                  type="submit"
                  className="flex py-2 bg-red-500 px-3 items-center gap-3 rounded-md hover:bg-red-700 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-red-400 relative"
                  onClick={handleLogout}
                >
                  <div className="flex w-full items-center justify-center gap-2">
                    Logout
                  </div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          <Login />
        )}
      </div>
    </>
  );
}
