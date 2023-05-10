import { CheckIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { SidebarButton } from "./SidebarButton";

interface Props {
  onClearConversations: () => void;
}

export const ClearConversations: FC<Props> = ({ onClearConversations }) => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleClearConversations = () => {
    onClearConversations();
    setIsConfirming(false);
  };

  return isConfirming ? (
    <div className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10">
      <TrashIcon className="w-[17.5px] h-[17.5px]" />

      <div className="flex-1 text-left leading-3 text-white">
        Are you sure?
      </div>

      <div className="flex w-[40px]">
        <CheckIcon
          className="ml-auto min-w-[20px] mr-1 text-neutral-400 hover:text-neutral-100"
          onClick={(e: any) => {
            e.stopPropagation();
            handleClearConversations();
          }}
        />

        <XMarkIcon
          className="ml-auto min-w-[20px] text-neutral-400 hover:text-neutral-100"
          onClick={(e: any) => {
            e.stopPropagation();
            setIsConfirming(false);
          }}
        />
      </div>
    </div>
  ) : (
    <SidebarButton
      text={"Clear conversations"}
      icon={<TrashIcon className="w-[17.5px] h-[17.5px]" />}
      onClick={() => setIsConfirming(true)}
    />
  );
};
