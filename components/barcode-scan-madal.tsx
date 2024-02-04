'use client';

import { Barcode } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import {
  Html5QrcodeCameraScanConfig,
  Html5QrcodeFullConfig,
  Html5QrcodeScanner,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from 'html5-qrcode';
import { Html5QrcodeScannerConfig } from 'html5-qrcode/esm/html5-qrcode-scanner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const qrcodeRegionId = 'html5qr-code-full-region';

const createConfig = ({
  fps,
  qrbox,
  aspectRatio,
  disableFlip,
}: Html5QrcodeCameraScanConfig) => {
  let config: Html5QrcodeScannerConfig = {
    fps: undefined,
  };
  if (fps) {
    config.fps = fps;
  }
  if (qrbox) {
    config.qrbox = qrbox;
  }
  if (aspectRatio) {
    config.aspectRatio = aspectRatio;
  }
  if (disableFlip !== undefined) {
    config.disableFlip = disableFlip;
  }
  return config;
};

const BarcodeScanner = (
  props: Html5QrcodeCameraScanConfig &
    Html5QrcodeFullConfig & {
      qrCodeSuccessCallback: QrcodeSuccessCallback;
      qrCodeErrorCallback: QrcodeErrorCallback;
      html5QrcodeScanner: MutableRefObject<Html5QrcodeScanner | null>;
    }
) => {
  const { html5QrcodeScanner } = props;

  useEffect(() => {
    const config = createConfig(props);
    const verbose = props.verbose === true;

    if (!props.qrCodeSuccessCallback) {
      throw 'qrCodeSuccessCallback is required callback.';
    }
    if (!html5QrcodeScanner.current?.getState()) {
      html5QrcodeScanner.current = new Html5QrcodeScanner(
        qrcodeRegionId,
        { ...config, formatsToSupport: [9] },
        verbose
      );

      html5QrcodeScanner.current?.render((decodedText, decodeResult) => {
        props.qrCodeSuccessCallback(decodedText, decodeResult);
        html5QrcodeScanner.current?.pause();
      }, undefined);
    }

    return () => {
      // html5QrcodeScanner.current?.clear();
      html5QrcodeScanner.current = null;
    };
  }, [html5QrcodeScanner, props]);

  return (
    <>
      <div id={qrcodeRegionId}></div>
    </>
  );
};

const BarcodeScanModal = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    authors: string[];
    contents: string;
    datetime: string;
    isbn: string;
    price: number;
    publisher: string;
    sale_price: number;
    status: string;
    thumbnail: string;
    title: string;
    translators: string[];
    url: string;
  } | null>(null);
  const html5QrcodeScanner = useRef<Html5QrcodeScanner | null>(null);

  const bookByIsbn = async (isbn: string) => {
    const res = await fetch(`/api/kakao/search?isbn=${isbn}`);
    const book = await res.json();

    return book;
  };

  const onNewScanResult: QrcodeSuccessCallback = async (
    decodedText,
    decodeResult
  ) => {
    try {
      const searchResult = await bookByIsbn(decodedText);
      setSearchResult(searchResult.book[0]);
    } catch (error) {
      console.error('[SEARCH_BOOK] ', error);
    }
  };

  const onScanFailure: QrcodeErrorCallback = (error) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  };

  const addBook = async () => {
    if (!searchResult) return;
    const { title, authors, publisher, thumbnail } = searchResult;

    try {
      await fetch('/api/books', {
        method: 'POST',
        body: JSON.stringify({
          title,
          author: authors.reduce((cur, author) => `${cur} ${author}`),
          publisher,
          imageUrl: thumbnail,
        }),
      });
      setOpen(false);
      setSearchResult(null);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const scanStart = () => {
    setSearchResult(null);
    html5QrcodeScanner.current?.resume();
  };

  const onOpenChange = (v: boolean) => {
    setSearchResult(null);
    setOpen(v);
    console.log('scanner', html5QrcodeScanner.current);
    if (!v) {
      html5QrcodeScanner.current?.clear();
      html5QrcodeScanner.current = null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant='outline' size='icon'>
            <Barcode />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-[640px]'>
          <DialogHeader>
            <DialogTitle>바코드 스캔</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            {searchResult ? (
              <div>
                <div className='relative overflow-hidden flex items-center flex-col gap-2'>
                  <Image
                    src={searchResult.thumbnail}
                    alt={searchResult.title}
                    width={200}
                    height={100}
                    className='aspect-book'
                  />
                  <div className=''>
                    <div className='font-semibold text-base'>
                      {searchResult.title}
                    </div>
                    <div className='text-xs'>
                      By{' '}
                      {searchResult.authors.reduce(
                        (str, author) => `${str} ${author}`
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <Button onClick={scanStart}>다시</Button>
                  <Button onClick={addBook}>추가</Button>
                </div>
              </div>
            ) : (
              searchResult === undefined && (
                <>
                  <Button onClick={scanStart}>다시</Button>
                </>
              )
            )}
            <div
              className={
                html5QrcodeScanner.current?.getState() === 3 ? 'hidden' : ''
              }
            >
              <BarcodeScanner
                fps={10}
                qrbox={360}
                disableFlip={false}
                verbose={true}
                qrCodeSuccessCallback={onNewScanResult}
                qrCodeErrorCallback={onScanFailure}
                html5QrcodeScanner={html5QrcodeScanner}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BarcodeScanModal;
