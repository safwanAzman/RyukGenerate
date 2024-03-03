import { create } from "zustand";

interface Loading {
  pendingCovert: boolean;
  pendingSpeech: boolean;
  setPendingCovert: (pendingCovert: boolean) => void;
  setPendingSpeech: (pendingSpeech: boolean) => void;
}

export const useLoading = create<Loading>((set) => ({
  pendingCovert: false,
  pendingSpeech: false,
  setPendingCovert: (pendingCovert: boolean) => set({ pendingCovert }),
  setPendingSpeech: (pendingSpeech: boolean) => set({ pendingSpeech }),
}));
