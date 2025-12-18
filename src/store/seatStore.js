import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useSeatStore = create(
  persist(
    (set) => ({
      seatBlock: null, // 예: "102", "A-15" 등
      seatNumber: null, // 예: "15", "23" 등
      zone: null, // 좌석 구역 정보 (서버에서 계산될 수 있음)
      lockerName: null, // 배정된 락커 이름
      lockerLocation: null, // 배정된 락커 위치
      
      setSeat: (block, number, zone = null) => {
        set({
          seatBlock: block,
          seatNumber: number,
          zone: zone
        });
      },
      
      setLocker: (lockerName, lockerLocation) => {
        set({
          lockerName,
          lockerLocation
        });
      },
      
      setSeatAndLocker: (block, lockerName, lockerLocation) => {
        set({
          seatBlock: block,
          lockerName,
          lockerLocation
        });
      },
      
      clearSeat: () => {
        set({
          seatBlock: null,
          seatNumber: null,
          zone: null,
          lockerName: null,
          lockerLocation: null
        });
      },
      
      hasSeat: () => {
        const state = useSeatStore.getState();
        return !!(state.seatBlock && state.seatNumber);
      },
      
      hasLocker: () => {
        const state = useSeatStore.getState();
        return !!(state.lockerName && state.lockerLocation);
      }
    }),
    {
      name: 'food-locker-seat-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSeatStore;

