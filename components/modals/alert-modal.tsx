"use client";

import { useEffect, useState } from "react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";


/**
 * Props for the AlertModal component.
 */
interface AlertModalProps {
    label: string;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}


/**
 * AlertModal component displays a modal with a confirmation message and buttons for canceling or continuing an action.
 */
export const AlertModal: React.FC<AlertModalProps> = ({
    label,
    isOpen,
    onClose,
    onConfirm,
    loading,
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Are you sure you want to delete:"
            label={label}
            description="This action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} variant="destructive" onClick={onConfirm}>Continue</Button>
            </div>
        </Modal>
    );
};
 