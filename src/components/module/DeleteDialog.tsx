import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { FiAlertOctagon, FiTrash2 } from "react-icons/fi";



interface DeleteDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  onDelete: () => void;
  openDialog: () => void;
  isLoading: boolean;
  title: string;
  subText: string;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ isOpen, closeDialog, onDelete, openDialog, isLoading, title, subText }) => {
  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"} className="w-8 h-8" onClick={openDialog}>
          <FiTrash2 size={16}/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] gap-4">
        <DialogHeader>
          <DialogTitle>
            Confirm deletion of
            <span className="text-muted-foreground"> {title}</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="rounded-md border py-4 px-6 flex space-x-4 items-start bg-red-200 border-destructive">
          <FiAlertOctagon size={20} className="text-destructive"/>
          <div>
            <h3 className="text-primary block text-sm font-normal mb-1">This action can not be undone.</h3>
            <p className="text-destructive">{subText}</p>
          </div>
        </DialogDescription>
        <DialogFooter className="!mt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isLoading} onClick={closeDialog}>
              Close
            </Button>
          </DialogClose>
          <Button type="button" onClick={onDelete} variant={"destructive"} disabled={isLoading} isLoading={isLoading} className="w-fit">
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;