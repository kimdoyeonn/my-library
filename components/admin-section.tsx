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
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import AddBookDialog from './add-book-dialog';
import BarcodeScanModal from './barcode-scan-madal';

const AdminSection = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { control, getValues, reset, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const checkAccount = async () => {
    try {
      const { name, email } = getValues();

      const account = await fetch(`/api/accounts?name=${name}&email=${email}`);
      if (account) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }

      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isAuthorized ? (
        <>
          <AddBookDialog />
          <BarcodeScanModal />
        </>
      ) : (
        <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
          <DialogTrigger asChild>
            <Button variant='outline' size='icon'>
              <LogIn />
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <form onSubmit={handleSubmit(checkAccount)}>
              <DialogHeader>
                <DialogTitle>로그인</DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    이름
                  </Label>
                  <Controller
                    control={control}
                    name='name'
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Input id='name' className='col-span-3' {...field} />
                    )}
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='email' className='text-right'>
                    이메일
                  </Label>
                  <Controller
                    control={control}
                    name='email'
                    rules={{
                      required: true,
                    }}
                    render={({ field }) => (
                      <Input id='email' className='col-span-3' {...field} />
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>로그인</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AdminSection;
