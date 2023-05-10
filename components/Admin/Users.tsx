"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ResizableTable from "./ResizableTable";

const VisiblityToggle = (props: any) => {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!visible);
  };

  return (
    <div className="flex items-center">
      <button
        className="text-blue-500 hover:text-blue-700 pr-2"
        onClick={toggle}
        aria-label="Toggle visibility"
      >
        {visible ? (
          <EyeIcon className="h-5 w-5" />
        ) : (
          <EyeSlashIcon className="h-5 w-5" />
        )}

        <span className="sr-only">Toggle visibility</span>
      </button>

      {visible ? (
        <p>{props.children}</p>
      ) : (
        <p>{"*".repeat(props.children.length)}</p>
      )}
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data?.users) setUsers(data.users);
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 w-full overflow-hidden pt-12">
      <h1 className="text-3xl font-bold mb-4">User List</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          className="w-full rounded-lg py-2 px-4 border-gray-400 shadow-md dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-96 overflow-y-auto">
        <ResizableTable className="w-full border-none text-left ml-2 max-h-96">
          <thead>
            <tr>
              <th
                scope="col"
                className="rounded hover:bg-gray-100 dark:hover:bg-gray-500 border-r border-gray-300 py-1 px-2 dark:text-white"
              >
                Email
              </th>
              <th
                scope="col"
                className="rounded hover:bg-gray-100 dark:hover:bg-gray-500 border-r border-gray-300 py-1 px-2 dark:text-white"
              >
                Temperature
              </th>
              <th
                scope="col"
                className="rounded hover:bg-gray-100 dark:hover:bg-gray-500 border-r border-gray-300 py-1 px-2 dark:text-white"
              >
                API Key
              </th>
              <th
                scope="col"
                className="rounded hover:bg-gray-100 dark:hover:bg-gray-500 border-r border-gray-300 py-1 px-2 dark:text-white"
              >
                Manage
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.email}
                style={{ maxWidth: "250px" }}
                className="hover:bg-indigo-100 dark:hover:bg-slate-500 rounded-lg"
              >
                <td scope="row" className="rounded-l md:p-1 p-2">
                  {user.email}
                </td>
                <td
                  className="md:p-1 p-2 dark:text-white"
                  style={{
                    maxWidth: "80px",
                  }}
                >
                  {user.temperature}
                </td>
                <td className="md:p-1 p-2 dark:text-white">
                  <VisiblityToggle>{user.apiKey}</VisiblityToggle>
                </td>
                <td className="md:p-1 p-2 rounded-r dark:text-white">
                  <button className="flex py-2 bg-green-500 px-3 items-center gap-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 relative">
                    <div className="flex w-full items-center justify-center gap-2">
                      View
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ResizableTable>
      </div>
    </div>
  );
};

export default UserList;
