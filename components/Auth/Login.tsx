"use client";
import { LinkIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function Login() {
	const [isLightTheme, setIsLightTheme] = useState(false);
	const [inIframe, setInIframe] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("theme") === "light") {
			setIsLightTheme(true);
		} else {
			setIsLightTheme(false);
		}
	}, []);

	useEffect(() => {
		if (isLightTheme) {
			console.log("light");
			document.documentElement.classList.remove("dark");
			localStorage.setItem("theme", "light");
		} else {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");

			console.log("dark");
		}
	}, [isLightTheme]);

	useEffect(() => {
		if (window.location !== window.parent.location) {
			setInIframe(true);
		}
	}, []);

	return (
		<div className="w-full h-full flex justify-center items-center flex-col text-black bg-gray-50 dark:bg-gray-800 dark:text-white p-2">
			<div className="w-auto md:w-96 flex flex-col justify-center items-center">
				<div className="mb-5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width={"41"}
						height={"41"}
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
				<div className="mb-2 text-center">Welcome to TechWithAnirudh ChatGPT</div>


				{!inIframe && (
					<div className="mb-4 text-center whitespace-pre-wrap">
						Log in with your TechWithAnirudh ChatGPT account in a new tab to start using this application
					</div>
				)}

				{!inIframe ? (
					<div className="flex flex-row gap-3">
						<button
							onClick={() => signIn()}
							className="flex py-2 bg-green-500 px-3 items-center gap-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 relative"
						>
							<div className="flex w-full items-center justify-center gap-2">
								Log in
							</div>
						</button>
						<button
							onClick={() => signIn()}
							className="flex py-2 bg-green-500 px-3 items-center gap-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 relative"
						>
							<div className="flex w-full items-center justify-center gap-2">
								Sign up
							</div>
						</button>
					</div>
				) : (
					<button
						onClick={() => window.open(window.location.href, "_blank")}
						className="flex py-2 bg-green-500 px-3 items-center gap-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 relative w-full"
					>
						<div className="flex w-full items-center justify-center gap-2">
							Open in new tab{" "}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 24 24"
							>
								<path
									fill="currentColor"
									d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13a.996.996 0 1 0 1.41 1.41L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z"
								/>
							</svg>
						</div>
					</button>
				)}
			</div>
		</div>
	);
}

export default Login;
