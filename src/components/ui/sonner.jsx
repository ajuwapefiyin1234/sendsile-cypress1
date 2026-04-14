// import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  // const { theme = "system" } = useTheme()

  return (
    <Sonner
      // theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg py-3 px-6 border border-[#EDEDED]',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      position="top-right" // Add this line
      expand={false} // Add this line if you want toasts to stay compact
      offset="16px" // Add this line to give some space from the edges
      {...props}
    />
  );
};

export { Toaster };
