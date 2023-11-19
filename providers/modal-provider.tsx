"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

/**
 * Provides a modal component to the application.
 * @returns The ModalProvider component.
 */
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    // If the component is not mounted, return null
    if (!isMounted) { 
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    );
}


// The purpose of the ModalProvider component is to provide a modal component to the application. It is responsible for rendering the StoreModal component

// Inside the ModalProvider component, there is a state variable isMounted that is initialized to false using the useState hook. The isMounted variable keeps track of whether the component has been mounted or not.

// The useEffect hook is used to update the isMounted state variable. It is called with an empty dependency array, which means it will only run once when the component is mounted. Inside the effect, the setIsMounted function is called with the value true, indicating that the component is now mounted.

// After the useEffect hook, there is an if statement that checks if the isMounted variable is false. If it is, the component returns null, effectively not rendering anything. This is a common pattern used to handle cases where a component needs to perform some initialization logic before rendering its content.

// Finally, the ModalProvider component returns the StoreModal component wrapped in an empty fragment. This means that when the isMounted variable is true, the StoreModal component will be rendered.
