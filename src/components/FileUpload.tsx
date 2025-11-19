'use client';

import { useState, useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

interface FileUploadProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
}

export default function FileUpload({ form, name, label }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const file = form.watch(name);

  useEffect(() => {
    if (file instanceof File) {
      setFileName(file.name);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreview('pdf');
      }
    } else {
      setPreview(null);
      setFileName(null);
    }
  }, [file]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) {
        form.setValue(name, droppedFile, { shouldValidate: true });
      }
    },
    [form, name]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    form.setValue(name, undefined, { shouldValidate: true });
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={cn(
                'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors',
                isDragging && 'border-primary bg-primary/10'
              )}
            >
              {preview ? (
                <>
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    {preview === 'pdf' ? (
                      <FileIcon className="h-16 w-16 text-gray-500" />
                    ) : (
                      <Image
                        src={preview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="max-h-40 w-auto rounded-md"
                      />
                    )}
                    <p className="mt-2 text-sm font-medium text-gray-700 truncate max-w-full px-2">
                      {fileName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <label
                  htmlFor={name}
                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Klik untuk mengunggah
                      </span>{' '}
                      atau seret file
                    </p>
                    <p className="text-xs text-gray-500">
                      Gambar atau PDF (Maks. 5MB)
                    </p>
                  </div>
                  <Input
                    id={name}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </label>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
