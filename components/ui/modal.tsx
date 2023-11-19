"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Modal component that displays a dialog with a title, description, and content.
 *
 * @param {string} title - The title of the modal.
 * @param {string} description - The description of the modal.
 * @param {boolean} isOpen - Determines whether the modal is open or closed.
 * @param {() => void} onClose - Callback function to be called when the modal is closed.
 * @param {React.ReactNode} children - The content to be displayed inside the modal.
 * @returns {React.ReactElement} The rendered modal component.
 */

/**
 * Modal component that displays a dialog with a title, description, and content.
 */
export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children,
}) => {
    /**
     * Handles the change event when the dialog is opened or closed.
     * @param open - Indicates whether the dialog is open or closed.
     */
    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>
    );
};
