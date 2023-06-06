"use client";
import { useRef, useState } from "react";
import {
  ChevronDownIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/20/solid";
import { Switch } from "@headlessui/react";
import FileUploaded from "@/components/fileUploaded";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  const [agreed, setAgreed] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const clearData = () => {
    setImageFiles(null);
  };

  const openFileExplorer = () => {
    const ref = fileRef.current;
    if (!ref) {
      return;
    }
    ref.click();
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Upload Images
        </h2>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Upload images of VIN numbers and text will be returned
        </p>
      </div>
      <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Image Selector
            </label>
            <div className="mt-2.5">
              <button
                className="relative block w-full rounded-lg border-2 border-dashed border-gray p-12 text-center hover:border-gray-400 mt-2"
                onClick={openFileExplorer}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileRef}
                  accept="image/*"
                  name="VinViles"
                  onChange={(e) => {
                    e.preventDefault();
                    console.log("uploading file");
                    if (e.target.files && e.target.files[0]) {
                      console.log("file uploaded");
                      setImageFiles(e.target.files);
                    }
                  }}
                  onClick={(e) => {
                    setImageFiles(null);
                    //@ts-ignore
                    e.target.value = null;
                  }}
                />
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-regular text-gray-600">
                  Click to browse files
                </span>
              </button>
            </div>
          </div>
        </div>
        {imageFiles && (
          <FileUploaded imageFiles={imageFiles} clearData={clearData} />
        )}
      </form>
    </div>
  );
}
