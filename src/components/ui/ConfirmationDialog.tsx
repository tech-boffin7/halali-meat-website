import { Button, ButtonProps } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmButtonText?: string;
  confirmVariant?: ButtonProps['variant'];
  isLoading?: boolean;
}

export function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmButtonText = 'Confirm',
  confirmVariant = 'default',
  isLoading = false
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-20px)] sm:w-full sm:max-w-[425px] rounded-[10px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm} disabled={isLoading} className="h-11 md:h-9 w-full sm:w-auto">{confirmButtonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
