import React, { useEffect, useState } from "react";
import { getProviders, signIn, getCsrfToken } from "next-auth/react";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function SignIn({ csrfToken, providers }: any): JSX.Element {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [counts, setCounts] = useState(0);
  const [error, setError] = useState({
    message: "",
    type: "",
  });

  useEffect(() => {
    document.body.classList.add("dark:bg-gray-800");

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

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleSecretPortal() {
    // On 10 times click, open modal
    if (counts === 9) {
      openModal();
      setCounts(0);
    }

    setCounts(counts + 1);
  }

  useEffect(() => {
    var url = new URL(window.location.href);
    var error = url.searchParams.get("error");

    if (error) {
      switch (error) {
        case "OAuthSignin":
          setError({
            message: "Error in constructing an authorization URL",
            type: "OAuthSignin",
          });
          break;
        case "OAuthCallback":
          setError({
            message: "Error in handling the response from an OAuth provider",
            type: "OAuthCallback",
          });
          break;
        case "OAuthCreateAccount":
          setError({
            message: "Could not create OAuth provider user in the database",
            type: "OAuthCreateAccount",
          });
          break;
        case "EmailCreateAccount":
          setError({
            message: "Could not create email provider user in the database",
            type: "EmailCreateAccount",
          });
          break;
        case "Callback":
          setError({
            message: "Error in the OAuth callback handler route",
            type: "Callback",
          });
          break;
        case "OAuthAccountNotLinked":
          setError({
            message:
              "The email on the account is already linked, but not with this OAuth account",
            type: "OAuthAccountNotLinked",
          });
          break;
        case "EmailSignin":
          setError({
            message: "Sending the e-mail with the verification token failed",
            type: "EmailSignin",
          });
          break;
        case "CredentialsSignin":
          setError({
            message:
              "The authorize callback returned null in the Credentials provider",
            type: "CredentialsSignin",
          });
          break;
        case "SessionRequired":
          setError({
            message:
              "The content of this page requires you to be signed in at all times",
            type: "SessionRequired",
          });
          break;
        case "Default":
          setError({
            message: "An unknown error occurred",
            type: "Default",
          });

          break;

        default:
          setError({
            message: "An unknown error occurred",
            type: "Default",
          });
          break;
      }
    }
  }, []);

  return (
    <>
      <style>
        {`
        .st0{fill:none;stroke:currentColor;stroke-width:20;stroke-linecap:round;stroke-miterlimit:3;}
        `}
      </style>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white">
                  <form
                    action="/api/auth/callback/credentials"
                    method="post"
                    className="w-full h-max"
                  >
                    <input
                      name="csrfToken"
                      type="hidden"
                      defaultValue={csrfToken}
                    />
                    <div>
                      <div className="text-sm font-bold text-gray-700 tracking-wide dark:text-white">
                        Account To Manage
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 dark:bg-gray-800"
                        type="email"
                        name="toView"
                        id="toView"
                        placeholder="hello@techwithanirudh.com"
                      />
                    </div>
                    <div className="mt-8">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-bold text-gray-700 tracking-wide dark:text-white">
                          Admin Password
                        </div>
                      </div>
                      <input
                        className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500 dark:bg-gray-800"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Admin Password"
                      />
                    </div>
                    <div className="mt-10">
                      <button
                        className="bg-green-500 text-gray-100 p-4 w-full rounded-full tracking-wide
  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-green-600
  shadow-lg"
                      >
                        Log In as Admin
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="lg:flex">
        <div className="lg:w-1/2 xl:max-w-screen-sm dark:bg-gray-800 dark:text-white">
          <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12  dark:bg-gray-800">
            <div className="cursor-pointer flex items-center">
              <div>
                <svg
                  className="w-10 h-10 -mb-1 p-0 text-indigo-500 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Layer_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 24 24"
                  xmlSpace="preserve"
                >
                  <path
                    fill="#6563ff"
                    d="M17 9H7a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2zm0 4H7a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2z"
                  />
                  <path
                    fill="#b2b1ff"
                    d="M19 2H5a3.003 3.003 0 0 0-3 3v10a3.003 3.003 0 0 0 3 3h11.586l3.707 3.707A1 1 0 0 0 22 21V5a3.003 3.003 0 0 0-3-3Zm-2 11H7a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2Zm0-4H7a1 1 0 0 1 0-2h10a1 1 0 0 1 0 2Z"
                  />
                </svg>
              </div>
              <div className="text-2xl text-indigo-800 tracking-wide ml-2 font-semibold dark:text-white">
                TechWithAnirudh ChatGPT
              </div>
            </div>
          </div>
          <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl dark:bg-gray-800">
            {error.type === "" ? (
              <>
                <h2
                  className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl
            xl:text-bold dark:text-white"
                >
                  Login
                </h2>
                <div className="mt-12 grid gap-3">
                  {Object.values(providers).map((provider: any) => {
                    if (provider.name === "Admin") {
                      return null;
                    }
                    return (
                      <div key={provider.name}>
                        <button
                          onClick={() => signIn(provider.id)}
                          type="button"
                          className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg inline-flex items-center justify-center gap-2"
                        >
                          {/* Get the icon from the provider */}
                          <img
                            src={
                              "https://authjs.dev/img/providers/" +
                              provider.id +
                              ".svg"
                            }
                            alt={provider.name}
                          />
                          Sign in with {provider.name}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <h2
                  className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl
             xl:text-bold dark:text-white"
                >
                  Error
                </h2>
                <div className="mt-12 grid gap-3">
                  <div className="text-center text-red-500 font-semibold">
                    {error.message}
                  </div>
                  <div>
                    <button
                      onClick={() => setError({ type: "", message: "" })}
                      type="button"
                      className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg inline-flex items-center justify-center gap-2"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center bg-indigo-100 flex-1 h-screen dark:bg-gray-900">
          <div className="max-w-xs transform duration-200 hover:scale-110 cursor-pointer">
            <svg
              className="w-5/6 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              id="f080dbb7-9b2b-439b-a118-60b91c514f72"
              data-name="Layer 1"
              viewBox="0 0 528.71721 699.76785"
              onClick={handleSecretPortal}
            >
              <title>Login</title>
              <rect y="17.06342" width="444" height="657" fill="#535461" />
              <polygon
                points="323 691.063 0 674.063 0 17.063 323 0.063 323 691.063"
                fill="#7f9cf5"
              />
              <circle cx="296" cy="377.06342" r="4" fill="#535461" />
              <polygon
                points="296 377.66 298.773 382.463 301.545 387.265 296 387.265 290.455 387.265 293.227 382.463 296 377.66"
                fill="#535461"
              />
              <polygon
                points="337 691.063 317.217 691 318 0.063 337 0.063 337 691.063"
                fill="#7f9cf5"
              />
              <g opacity="0.1">
                <polygon
                  points="337.217 691 317.217 691 318.217 0 337.217 0 337.217 691"
                  fill="#fff"
                />
              </g>
              <circle cx="296" cy="348.06342" r="13" opacity="0.1" />
              <circle cx="296" cy="346.06342" r="13" fill="#535461" />
              <line
                x1="52.81943"
                y1="16.10799"
                x2="52.81943"
                y2="677.15616"
                fill="none"
                stroke="#000"
                stroke-miterlimit="10"
                stroke-width="2"
                opacity="0.1"
              />
              <line
                x1="109.81943"
                y1="12.10799"
                x2="109.81943"
                y2="679.15616"
                fill="none"
                stroke="#000"
                stroke-miterlimit="10"
                stroke-width="2"
                opacity="0.1"
              />
              <line
                x1="166.81943"
                y1="9.10799"
                x2="166.81943"
                y2="683"
                fill="none"
                stroke="#000"
                stroke-miterlimit="10"
                stroke-width="2"
                opacity="0.1"
              />
              <line
                x1="223.81943"
                y1="6.10799"
                x2="223.81943"
                y2="687.15616"
                fill="none"
                stroke="#000"
                stroke-miterlimit="10"
                stroke-width="2"
                opacity="0.1"
              />
              <line
                x1="280.81943"
                y1="3.10799"
                x2="280.81943"
                y2="688"
                fill="none"
                stroke="#000"
                stroke-miterlimit="10"
                stroke-width="2"
                opacity="0.1"
              />
              <ellipse
                cx="463.21721"
                cy="95.32341"
                rx="39.5"
                ry="37"
                fill="#2f2e41"
              />
              <path
                d="M683.8586,425.93948l-10,14s-48,10-30,25,44-14,44-14l14-18Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#ffb8b8"
              />
              <path
                d="M735.8586,266.93948s-13,0-16,18-6,78-6,78-42,55-35,62,15,20,20,18,48-61,48-61Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#7f9cf5"
              />
              <path
                d="M735.8586,266.93948s-13,0-16,18-6,78-6,78-42,55-35,62,15,20,20,18,48-61,48-61Z"
                transform="translate(-335.6414 -100.11607)"
                opacity="0.1"
              />
              <path
                d="M775.8586,215.93948s-1,39-13,41-8,15-8,15,39,23,65,0l5-12s-18-13-10-31Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#ffb8b8"
              />
              <path
                d="M708.8586,455.93948s-59,110-37,144,55,104,60,104,33-14,31-23-32-76-40-82-4-22-3-23,34-54,34-54-1,84,3,97-1,106,4,110,28,11,32,5,16-97,8-118l15-144Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#2f2e41"
              />
              <path
                d="M762.8586,722.93948l-25,46s-36,26-11,30,40-6,40-6l22-16v-46Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#2f2e41"
              />
              <path
                d="M728.8586,696.93948l13,31s5,13,0,16-19,21-10,23a29.29979,29.29979,0,0,0,5.49538.5463,55.56592,55.56592,0,0,0,40.39768-16.43936l8.10694-8.10694s-27.77007-63.94827-27.385-63.47414S728.8586,696.93948,728.8586,696.93948Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#2f2e41"
              />
              <circle cx="465.21721" cy="105.82341" r="34" fill="#ffb8b8" />
              <path
                d="M820.3586,253.43948l-10.5,10.5s-32,12-47,0c0,0,5.5-11.5,5.5-10.5s-43.5,7.5-47.5,25.5,3,49,3,49-28,132-17,135,114,28,113,9,8-97,8-97l35-67s-5-22-17-29S820.3586,253.43948,820.3586,253.43948Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#7f9cf5"
              />
              <path
                d="M775.8586,448.93948l-13,8s-50,34-24,40,41-24,41-24l10-12Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#ffb8b8"
              />
              <path
                d="M849.8586,301.93948l9,9s6,84-6,101-67,63-70,60-22-18-18-20,57.18287-57.56942,57.18287-57.56942l-4.18287-77.43058Z"
                transform="translate(-335.6414 -100.11607)"
                opacity="0.1"
              />
              <path
                d="M853.8586,298.93948l9,9s6,84-6,101-67,63-70,60-22-18-18-20,57.18287-57.56942,57.18287-57.56942l-4.18287-77.43058Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#7f9cf5"
              />
              <path
                d="M786.797,157.64461s-11.5575-4.20273-27.31774,4.72807l8.40546,2.10136s-12.60819,1.05068-14.18421,17.8616h5.77875s-3.67739,14.70955,0,18.91228l2.364-4.4654,6.82943,13.65887,1.576-6.82944,3.15205,1.05069,2.10137-11.03217s5.25341,7.88012,9.45614,8.40546V195.2065s11.5575,13.13352,15.23489,12.60818l-5.25341-7.35477,7.35477,1.576-3.152-5.25341,18.91228,5.25341-4.20273-5.25341,13.13352,4.20273,6.3041,2.6267s8.9308-20.4883-3.67739-34.67251S798.61712,151.60318,786.797,157.64461Z"
                transform="translate(-335.6414 -100.11607)"
                fill="#2f2e41"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();
  return {
    props: { csrfToken, providers },
  };
}
