import { useEffect } from "react";

const useBeforeUnload = (isDirty) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        const message =
          "Are you sure you want to leave? Your changes may not be saved.";
        event.returnValue = message; // Legacy way to display a message
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);
};

export default useBeforeUnload;
