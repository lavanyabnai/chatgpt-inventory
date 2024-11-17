import { create } from "zustand";

type OpenCashaccountState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenCashaccount = create<OpenCashaccountState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
