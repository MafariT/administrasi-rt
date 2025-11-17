'use client';

import { toast } from 'sonner';
import { useFormStatus } from 'react-dom';
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
import {
  updateAdminPassword,
  updateAdminProfile,
} from '@/app/(admin)/admin/profile/action';
import { Spinner } from '../ui/spinner';

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Spinner /> : children}
    </Button>
  );
}

export default function AdminProfileModal({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; full_name: string | null } | null;
}) {
  const handleProfileUpdate = async (formData: FormData) => {
    toast.promise(updateAdminProfile(formData), {
      loading: 'Memperbarui profil...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onClose();
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  const handlePasswordUpdate = async (formData: FormData) => {
    toast.promise(updateAdminPassword(formData), {
      loading: 'Memperbarui password...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Profil Saya</DialogTitle>
        </DialogHeader>

        <form action={handleProfileUpdate} className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nama Lengkap</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={user?.full_name ?? ''}
            />
          </div>
          <DialogFooter>
            <SubmitButton>Simpan Nama</SubmitButton>
          </DialogFooter>
        </form>

        <form action={handlePasswordUpdate} className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-gray-800">Ubah Password</h4>
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 6 karakter"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
            />
          </div>
          <DialogFooter>
            <SubmitButton>Ubah Password</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
