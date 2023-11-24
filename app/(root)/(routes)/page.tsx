'use client'; 

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

/**
 * Renders the setup page component.
 * Opens the modal if it is not already open.
 */
const SetupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen) { 
      onOpen();
    }
  }, [isOpen, onOpen]);

  // The SetupPage component returns null, which means that nothing is rendered, it only opens the modal.
  return null 
}
export default SetupPage;


// At the beginning of the file, the useStoreModal hook is imported from the use-store-modal module. This hook allows the component to access the modal state and related functions. Additionally, the useEffect hook is imported from the react module, which enables the component to perform side effects.

// The SetupPage component is defined as a functional component. Inside the component, two variables are declared using the useStoreModal hook. The onOpen variable is assigned the onOpen function from the modal store, and the isOpen variable is assigned the isOpen state value. These variables will be used to check the current state of the modal.

// The useEffect hook is then used to perform a side effect. It takes a callback function as its first argument and an array of dependencies as its second argument. In this case, the callback function checks if the modal is not already open (isOpen is false). If the modal is not open, it calls the onOpen function to open the modal. The dependency array includes isOpen and onOpen, which ensures that the effect is triggered whenever these values change.
