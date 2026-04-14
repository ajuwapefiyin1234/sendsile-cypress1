import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";

const DrawerDialog = ({ open, setOpen, children, title }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateSide = () => {
      if (window.innerWidth < 768) {
        setIsDesktop(false); // Bottom for mobile
      } else {
        setIsDesktop(true); // Right for larger screens
      }
    };

    window.addEventListener("resize", updateSide);
    updateSide(); // Initial call

    return () => {
      window.removeEventListener("resize", updateSide);
    };
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title || ""}</DrawerTitle>
        </DrawerHeader>
        <div className="flex items-center justify-center px-4 pb-16">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

DrawerDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default DrawerDialog;
