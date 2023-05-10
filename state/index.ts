import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const messageAtom = atom<string>("");
export const activeChatAtom = atom<{
  id: string;
  name: string;
}>({
  id: "",
  name: "Home",
});

export const AppSettings = {
  delayMsMultiplier: atomWithStorage<number>("settingsDelayMsMultiplier", 25),
};
