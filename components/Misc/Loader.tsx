"use client";
import React, { useEffect, useState } from "react";

type Props = {
	error?: any;
}

export default function Loader({ error }: Props) {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<div
			className={`fixed top-0 left-0 w-full h-full z-[1000] bg-white dark:bg-gray-900 flex-col gap-6 items-center justify-center ${isLoading ? "flex" : "hidden"
				}`}
		>
			<a className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></a>
			{!error ? (
				<div className="text-center text-2xl text-black/50 dark:text-white/50">
					Shamelessly copied from{" "}
					<a
						href="https://replit.com/@techwithanirudh"
						className="text-black/100 dark:text-white/100 hover:text-black/70 dark:hover:text-white/70"
					>
						@techwithanirudh
					</a>
				</div>
			) : (
				<div className="text-center text-2xl text-red-500">
					{error.message}
				</div>
			)}
		</div>
	);
}
