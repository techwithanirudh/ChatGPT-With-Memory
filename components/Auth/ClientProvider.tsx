"use client";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { toast, Toaster, ToastBar } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Loader from "../Misc/Loader";

function ClientProvider() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "dark:bg-gray-800 bg-white text-black/100 dark:text-white/100 rounded-md shadow-md",
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                <p className="text-black/70 dark:text-white/70">{message}</p>
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)}>
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}

export default ClientProvider;
