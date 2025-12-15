import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(i => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options));
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.id === existingItem.id && JSON.stringify(i.options) === JSON.stringify(existingItem.options)
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (itemId, options = null) => {
        const items = get().items;
        set({
          items: items.filter(i => {
            if (options) {
              return !(i.id === itemId && JSON.stringify(i.options) === JSON.stringify(options));
            }
            return i.id !== itemId;
          })
        });
      },
      
      updateQuantity: (itemId, quantity, options = null) => {
        if (quantity <= 0) {
          get().removeItem(itemId, options);
          return;
        }
        
        const items = get().items;
        set({
          items: items.map(i => {
            if (options) {
              if (i.id === itemId && JSON.stringify(i.options) === JSON.stringify(options)) {
                return { ...i, quantity };
              }
            } else {
              if (i.id === itemId) {
                return { ...i, quantity };
              }
            }
            return i;
          })
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'food-locker-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;

