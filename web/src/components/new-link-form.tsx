import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from './ui';
import { createLinkSchema, useCreateLink, type CreateLinkData } from '@/lib/api';
import { useState } from 'react';

interface NewLinkFormProps {
  onLinkCreated: () => void;
  className?: string;
}

export function NewLinkForm({ onLinkCreated, className }: NewLinkFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  const createLinkMutation = useCreateLink();

  const handleFormSubmit = async (data: CreateLinkData) => {
    setErrorMessage(null);
    try {
      await createLinkMutation.mutateAsync(data);
      reset();
      onLinkCreated();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className={`bg-[#F9F9FB] rounded-lg p-6 md:p-8 ${className}`}>
      <h2 className="text-lg font-bold text-[#1F2025] mb-6">
        Novo link
      </h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
        <Input
          label="link original"
          placeholder="www.exemplo.com.br"
          {...register('originalUrl')}
          error={errors.originalUrl?.message}
          required
        />
        
        <Input
          label="link encurtado"
          prefix="brev.ly/"
          placeholder=""
          {...register('shortUrl')}
          error={errors.shortUrl?.message}
        />

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>
    </div>
  );
}