import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
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
  return (
    <>
      <div className="">
        {Array.from(imageFiles).map((imageFile) => {
          return <CardElement file={imageFile} key={imageFile.name} />;
        })}
      </div>
    </>
  );
}

function CardElement({ file }: { file: File }) {
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
      onClick={() => navigator.clipboard.writeText(image.vin ?? "")}
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
