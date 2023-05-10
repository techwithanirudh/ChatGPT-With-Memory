import SessionProvider from "../components/Auth/SessionProvider";
import SideBar from "../components/Sidebar/Sidebar";
import { getServerSession } from "next-auth";
import "../styles/globals.css";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from "../components/Auth/Login";
import ClientProvider from "../components/Auth/ClientProvider";
import Loader from "../components/Misc/Loader";
import { Navbar } from "../components/Mobile/Navbar";

export const metadata = {
  title: "ChatGPT Clone",
  description: "Fully fledged ChatGPT Clone created by @techwithanirudh",
	icons: {
    icon: 'https://cdn.iconscout.com/icon/free/png-256/chat-bubble-1851157-1569206.png?f=webp&w=128',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {	
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="dark:bg-gray-800">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       
        <SessionProvider session={session}>
          {!session ? (
            <div className="overflow-hidden w-full h-full relative">
              <Login />
            </div>
          ) : (
            <main className="flex h-screen w-screen flex-col text-black dark:text-white">
              <div className="fixed top-0 w-full sm:hidden">
                <Navbar />
              </div>
              <div className="flex h-full w-full pt-[48px] sm:pt-0">
                <div className="text-white">
                  <SideBar />
                </div>

                <div className="flex-1 flex">
                  <ClientProvider />

                  {children}
                </div>
              </div>
            </main>
          )}
        </SessionProvider>

        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="techwithanirudh"
          data-description="Support me on Buy me a coffee!"
          data-message="Help keep this app alive by donating! Your support is greatly appreciated. Thank you!"
          data-color="#5F7FFF"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
        ></script>
      </body>
    </html>
  );
}
