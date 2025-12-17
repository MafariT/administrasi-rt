'use client';

import { createAdmin } from '@/app/(admin)/admin/pengaturan/actions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Menambahkan...' : 'Tambah Admin'}
    </Button>
  );
}

export default function AddAdminModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleSubmit = async (formData: FormData) => {
    const promise = () => createAdmin(formData);

    toast.promise(promise, {
      loading: 'Membuat akun...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onClose();
        return result.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Admin Baru</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input name="fullName" required placeholder="Nama Admin" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              required
              placeholder="email@rt012.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              required
              placeholder="Minimal 6 karakter"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
