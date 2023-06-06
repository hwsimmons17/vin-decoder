import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type vinImage = {
  key: string;
  file: File;
  vin: string | null;
};

export default function FileUploaded({
  imageFiles,
  clearData,
}: {
  imageFiles: FileList;
  clearData: () => void;
}) {
  const [displayCopied, setDisplayCopied] = useState(false);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setDisplayCopied(true);
    setTimeout(() => setDisplayCopied(false), 1000);
  };
  return (
    <>
      <div className="">
        {displayCopied && <CopiedCode />}
        {Array.from(imageFiles).map((imageFile) => {
          return (
            <CardElement file={imageFile} key={imageFile.name} copy={copy} />
          );
        })}
      </div>
    </>
  );
}

function CardElement({
  file,
  copy,
}: {
  file: File;
  copy: (text: string) => void;
}) {
  const [image, setImage] = useState<vinImage>({
    file,
    key: file.name,
    vin: null,
  });

  const getVin = async (file: File) => {
    var formData = new FormData();
    formData.append("image", file);
    const response = await fetch("/api/vin", {
      method: "POST",
      body: formData,
    });

    let vinRes = await response.json();
    setImage({ file, key: file.name, vin: vinRes.vinNumber });
  };

  useEffect(() => {
    getVin(file);
  }, []);
  return (
    <button
      className="relative w-full rounded-lg border-2 border-dashed border-gray p-2 text-center hover:border-gray-400 mt-6"
      key={image.key}
      onClick={() => copy(image.vin ?? "")}
    >
      <div>
        <div className="flex item-center justify-between">
          <div className="flex justify-center item-center mt-1.5">
            <ArchiveBoxIcon className="h-6 w-6 text-gray m-0 mx-2" />
            <span className="text-sm font-regular text-gray flex item-center align-baseline inline-block mx-2">
              {image.key}
            </span>
          </div>
          <div className="h-6">
            {image.vin ? (
              <CheckCircleIcon className="h-6 w-6 text-green-600 mt-1" />
            ) : (
              <Spinner />
            )}
          </div>
        </div>
        {image.vin && (
          <div className="flex item-center justify-center mt-2">
            <ClipboardDocumentIcon className="h-6 w-6" />
            <div className="flex justify-center item-center mt-1.5">
              <span className="text-sm font-regular text-gray flex item-center align-baseline inline-block mx-2">
                Vin Number: {image.vin}
              </span>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

function CopiedCode() {
  return (
    <div className="rounded-md bg-green-50 p-4 mt-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">
            Copied to clipboard
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 text-gray border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}
