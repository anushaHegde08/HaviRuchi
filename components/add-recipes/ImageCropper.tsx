"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";

interface ImageCropperProps {
  open: boolean;
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  circularCrop?: boolean;
  outputSize?: number;
}

// helper — center a square crop on the image
function centerSquareCrop(width: number, height: number): Crop {
  return centerCrop(
    makeAspectCrop(
      { unit: "%", width: 90 },
      1, // ← 1:1 aspect ratio (square)
      width,
      height,
    ),
    width,
    height,
  );
}

// helper — draw cropped image on canvas and convert to File
async function getCroppedFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  outputSize: number = 800
): Promise<File> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas not supported");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // output size
  canvas.width = outputSize;
  canvas.height = outputSize;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    outputSize,
    outputSize,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9, // quality
    );
  });
}

export const ImageCropper = ({
  open,
  imageSrc,
  onCropComplete,
  onCancel,
  circularCrop = false,
  outputSize = 800,
}: ImageCropperProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [loading, setLoading] = useState(false);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    // auto center square crop on load
    setCrop(centerSquareCrop(width, height));
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      setLoading(true);
      const croppedFile = await getCroppedFile(
        imgRef.current,
        completedCrop,
        "cropped-image.jpg",
        outputSize
      );
      onCropComplete(croppedFile);
    } catch (error) {
      console.error("Crop failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Drag to adjust. Image will be cropped to a square.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center max-h-[60vh] overflow-auto">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // ← forces 1:1 square
            minWidth={100}
            minHeight={100}
            circularCrop={circularCrop}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{ maxHeight: "60vh", maxWidth: "100%" }}
            />
          </ReactCrop>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleCropConfirm}
            disabled={!completedCrop || loading}
            className="flex-1"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Cropping...
              </span>
            ) : (
              "Use This Image"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
