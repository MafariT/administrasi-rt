'use client'

import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? 'Menolak...' : 'Tolak Pendaftaran'}
    </Button>
  )
}

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: (reason: string) => Promise<{ success: boolean; message: string }>;
}

export default function RejectionModal({ isOpen, onClose, action }: RejectionModalProps) {
  
  const handleFormAction = async (formData: FormData) => {
    const reason = formData.get('reason') as string;
    if (!reason || reason.trim().length < 10) {
      toast.error("Harap berikan alasan penolakan yang jelas (minimal 10 karakter).");
      return;
    }

    const promise = () => action(reason);
    
    toast.promise(promise, {
      loading: 'Memproses penolakan...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onClose();
        return result.message;
      },
      error: (error) => error.message,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tolak Permintaan</DialogTitle>
          <DialogDescription>
            Harap berikan alasan yang jelas mengapa permintaan ini ditolak. Alasan ini akan dapat dilihat oleh pemohon.
          </DialogDescription>
        </DialogHeader>
        <form action={handleFormAction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan Penolakan</Label>
            <Textarea 
              id="reason" 
              name="reason" 
              required 
              minLength={10}
              placeholder="Foto KTP yang diunggah tidak jelas/buram. Harap daftar ulang dengan foto yang lebih baik..." 
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}