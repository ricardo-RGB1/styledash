"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void; 
  onRemove: (value: string) => void;
  value: string[];
}
// The onChange prop is called when an image is successfully uploaded. It receives the URL of the uploaded image as an argument.


const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Handles the upload result and updates the value.
   * @param result - The upload result.
   */
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="zyemsbvo">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;



// The component maintains a state variable isMounted to track whether the component has mounted. This is used to prevent rendering the component before it has mounted.

// The onUpload function is called when an image is successfully uploaded. It calls the onChange prop with the URL of the uploaded image.

// The component renders a list of currently uploaded images. Each image is displayed with a remove button. When the remove button is clicked, the onRemove prop is called with the URL of the image to be removed.

// The component also renders a CldUploadWidget from the next-cloudinary package. This widget handles the process of uploading an image to Cloudinary. When an image is successfully uploaded, the onUpload function is called.

// The CldUploadWidget is rendered with a function as a child. This function receives an open function as an argument, which can be called to open the upload widget. The function returns a button that, when clicked, opens the upload widget. The button is disabled if the disabled prop is true.