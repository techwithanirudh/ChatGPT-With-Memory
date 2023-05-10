import { Dialog, Transition } from "@headlessui/react";
import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment, useState } from "react";
import { SidebarButton } from "./SidebarButton";

export default function PluginsModal() {
  let [isOpen, setIsOpen] = useState(false);
  let [plugins, setPlugins] = useState([
    {
      id: "todo",
      name: "Todo",
      description:
        "A simple plugin that allows you to create todo items while chatting. It allows you to create and delete todos.",
      icon: "https://cdn-icons-png.flaticon.com/128/2387/2387635.png",
      installed: true,
    },
  ]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <SidebarButton
        icon={<PuzzlePieceIcon className="w-[17.5px] h-[17.5px]" />}
        text="Plugins"
        onClick={openModal}
      />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800 dark:text-white">
                  <div className="w-full h-max flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Plugins</h1>
                    <button
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
                      onClick={closeModal}
                    >
                      <XMarkIcon className="w-8 h-8" />
                    </button>
                  </div>

                  {/* A grid of plugins which is responsive automatically without breakpoints using fr like grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-h-[500px] overflow-y-auto">
                    {plugins.map((plugin) => (
                      <div className="flex flex-col gap-2 border border-gray-200/20 rounded-md p-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-[70px] h-[70px] rounded-lg p-1 bg-gray-200/20 dark:bg-gray-600"
                            style={{
                              backgroundImage: `url(${plugin.icon})`,
                              //   Spacing between background image and border
                              backgroundOrigin: "content-box",
                              backgroundSize: "contain",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                            }}
                          ></div>
                          <div className="flex flex-col gap-1">
                            <h1 className="text-lg font-semibold">
                              {plugin.name}
                            </h1>
                            <button
                              className="flex py-2 bg-green-500 px-3 items-center gap-3 rounded-md hover:bg-green-700 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20 relative w-max"
                              type="button"
                            >
                              <div
                                className="flex w-full items-center justify-between gap-2"
                                onClick={() => {
                                  setPlugins(
                                    plugins.map((p) => {
                                      if (p.id === plugin.id) {
                                        return {
                                          ...p,
                                          installed: !p.installed,
                                        };
                                      }
                                      return p;
                                    })
                                  );
                                }}
                              >
                                {plugin.installed ? (
                                  <>
                                    <span>Uninstall</span>
                                    <TrashIcon className="w-4 h-4" />
                                  </>
                                ) : (
                                  <>
                                    <span>Install</span>
                                    <ArrowDownIcon className="w-4 h-4" />
                                  </>
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">
                          {plugin.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
