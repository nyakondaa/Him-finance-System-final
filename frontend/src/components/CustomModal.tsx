// src/components/CustomModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomModalProps {
  message: string | React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  showConfirmButton?: boolean;
  title?: string;
  isOpen: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  message,
  onClose,
  onConfirm,
  showConfirmButton = false,
  title = "Notification",
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Ensure overlay covers full viewport */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <DialogContent className="sm:max-w-[425px] w-full bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-base mt-2">
              {message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            {showConfirmButton && onConfirm && (
              <Button
                variant="destructive"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Confirm
              </Button>
            )}
            <Button
              variant={showConfirmButton ? "outline" : "default"}
              onClick={onClose}
            >
              {showConfirmButton ? "Cancel" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default CustomModal;
