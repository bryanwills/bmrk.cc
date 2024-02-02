'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { ArrowUpCircle, File } from 'lucide-react';
import { toast } from 'sonner';

import Loader from 'components/loader';
import { Dialog, DialogContent, DialogTitle } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

import { cn, getBrowserName } from 'lib/utils';

type UploadModalProps = {
  open: boolean;
  onHide: (open: boolean) => void;
};

const helpLinks: { [key: string]: string } = {
  chrome: 'https://support.google.com/chrome/answer/96816?hl=en',
  safari:
    'https://www.idownloadblog.com/2016/10/17/exporting-safari-bookmarks-from-iphone-ipad-mac-pc/',
  firefox:
    'https://support.mozilla.org/en-US/kb/export-firefox-bookmarks-to-backup-or-transfer',
};

export default function UploadModal({ open, onHide }: UploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const createBookmarks = async (content: string | ArrayBuffer | null) => {
    if (!content) {
      toast.error('Error occurred, try again');
    }
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message);
      }
      onHide(false);
      toast.success('Bookmarks are successfully created');
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = ({ target }: { target: HTMLInputElement }) => {
    const files = target?.files ?? [];
    if (files && files.length) {
      const file = files[0];
      if (file) {
        setFileName(file.name);
      }
    }
  };

  const onSubmit = () => {
    try {
      const files = hiddenInputRef.current?.files ?? [];
      if (files && files.length) {
        const file = files[0];
        if (file) {
          toast.info(`Don't refresh this page.`, {
            duration: 6000,
          });
          setLoading(true);
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = async function () {
            const content = reader.result;
            await createBookmarks(content);
          };
        }
      }
    } catch {
      toast.error('Error occurred, try again');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(hide) => onHide(hide)}>
      <DialogContent className="sm:max-w-md py-2 px-3">
        <DialogTitle className="flex items-center font-medium gap-1.5 mt-1.5">
          <File className="w-4 h-4" /> Upload bookmarks
        </DialogTitle>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <div className="relative h-48 border border-neutral-400 border-dashed rounded-lg">
            <Input
              className="opacity-0"
              type="file"
              accept=".html"
              ref={hiddenInputRef}
              onChange={onFileChange}
            />
            <button
              type="button"
              onClick={() => {
                hiddenInputRef.current?.click();
              }}
              className="flex w-full justify-center flex-col items-center"
            >
              <ArrowUpCircle
                strokeWidth={1}
                className="text-neutral-500 w-9 h-9"
              />
              <p className="text-sm mt-2 font-medium">Click to select</p>
            </button>
            <p className="text-sm mt-1 text-neutral-500 text-center">
              {fileName.length ? (
                fileName
              ) : (
                <>
                  Select exported HTML bookmark file{' '}
                  <Tooltip>
                    <TooltipTrigger
                      onClick={(event) => {
                        event.stopPropagation();
                        let name = getBrowserName();
                        const link = helpLinks[name] ?? helpLinks['chrome'];
                        window.open(link, '_blank');
                      }}
                    >
                      <QuestionMarkCircledIcon className="w-3.5 relative -top-0.5 h-3.5 text-pink-700 " />
                    </TooltipTrigger>
                    <TooltipContent>
                      Click to know how to export your bookmarks.
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </p>
          </div>
          <div className="flex w-full justify-end mt-3 mb-1">
            <button
              type="submit"
              disabled={loading || !fileName.length}
              className={cn(
                `rounded-full h-[40px] items-center disabled:bg-blue-200 focus:outline-0 focus:bg-blue-700 active:bg-blue-700 border-0 flex justify-center py-2 px-5 text-white bg-blue-600 hover:bg-blue-700`,
                {
                  '!bg-blue-200 cursor-not-allowed': loading,
                },
              )}
            >
              {loading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}