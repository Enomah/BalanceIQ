import { useCallback } from "react";
import html2canvas from "html2canvas";

export const useShoppingListExport = () => {
  const captureScreenshot = useCallback(
    async (elementId: string, filename: string) => {
      try {
        const element = document.getElementById(elementId);
        if (!element) {
          throw new Error("Element not found");
        }

        const canvas = await html2canvas(element, {
          backgroundColor: "#ffffff",
          scale: 2,
        });

        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL();
        link.click();

        return true;
      } catch (error) {
        console.error("Screenshot capture failed:", error);
        return false;
      }
    },
    []
  );

  return {
    captureScreenshot,
  };
};
