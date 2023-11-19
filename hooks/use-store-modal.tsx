import { create } from 'zustand';

/**
 * Represents the store for managing the modal state in useStoreModal hook.
 */
interface useStoreModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

/**
 * Custom hook for managing the store modal state.
 * @returns An object containing the isOpen, onOpen, and onClose functions.
 */
export const useStoreModal = create<useStoreModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));