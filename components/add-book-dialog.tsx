'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const AddBookDialog = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { control, watch, getValues, reset, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      imageUrl: '',
    },
  });

  const createBook = async () => {
    const { title, author, publisher, imageUrl } = getValues();

    try {
      await axios.post('/api/books', {
        title,
        author,
        publisher,
        imageUrl,
      });
      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={handleSubmit(createBook)}>
          <DialogHeader>
            <DialogTitle>도서 추가</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='title' className='text-right'>
                도서명
              </Label>
              <Controller
                control={control}
                name='title'
                rules={{
                  required: true,
                }}
                render={({ field }) => (
                  <Input id='title' className='col-span-3' {...field} />
                )}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='author' className='text-right'>
                저자
              </Label>
              <Controller
                control={control}
                name='author'
                render={({ field }) => (
                  <Input id='author' className='col-span-3' {...field} />
                )}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='publisher' className='text-right'>
                출판사
              </Label>
              <Controller
                control={control}
                name='publisher'
                render={({ field }) => (
                  <Input id='publisher' className='col-span-3' {...field} />
                )}
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='imageUrl' className='text-right'>
                표지url
              </Label>
              <Controller
                control={control}
                name='imageUrl'
                render={({ field }) => (
                  <Input id='imageUrl' className='col-span-3' {...field} />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookDialog;
