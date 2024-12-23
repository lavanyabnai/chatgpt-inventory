import { create } from "zustand";

type NewAssetsconstraintState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAssetsconstraint = create<NewAssetsconstraintState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
