import { create } from "zustand";

export interface MockPosition {
  id: string;
  poolAddress: string;
  positionAddress: string;
  baseToken: string;
  quoteToken: string;
  minPrice: number;
  maxPrice: number;
  depositAmount: number;
  numberOfBins: number;
  createdAt: Date;
}

interface MockPositionsStore {
  positions: MockPosition[];
  addPosition: (position: MockPosition) => void;
  clearPositions: () => void;
}

export const useMockPositionsStore = create<MockPositionsStore>((set) => ({
  positions: [],
  addPosition: (position) =>
    set((state) => ({
      positions: [position, ...state.positions],
    })),
  clearPositions: () => set({ positions: [] }),
}));
