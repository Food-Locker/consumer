import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSeatStore = create(
  persist(
    (set) => ({
      seatBlock: null, // 예: "102", "A-15" 등
      seatNumber: null, // 예: "15", "23" 등
      zone: null, // 좌석 구역 정보 (서버에서 계산될 수 있음)
      
      setSeat: (block, number, zone = null) => {
        set({
          seatBlock: block,
          seatNumber: number,
          zone: zone
        });
      },
      
      clearSeat: () => {
        set({
          seatBlock: null,
          seatNumber: null,
          zone: null
        });
      },
      
      hasSeat: () => {
        const state = useSeatStore.getState();
        return !!(state.seatBlock && state.seatNumber);
      }
    }),
    {
      name: 'food-locker-seat-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSeatStore;

