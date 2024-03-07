import { create } from "zustand";

interface about {
  aboutPage: boolean;
  setAboutPage: (about: boolean) => void;
}

export const useAbout = create<about>((set) => ({
  aboutPage: true,
  setAboutPage: (aboutPage: boolean) => set({ aboutPage }),
}));
