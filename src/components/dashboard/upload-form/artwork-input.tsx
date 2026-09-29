import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ArtworkInputProps {
  artworkPreview: string | null;
  onFileSelect: (file: File) => void;
}

export const ArtworkInput = ({ artworkPreview, onFileSelect }: ArtworkInputProps) => {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="artwork">Artwork</Label>
      <div className="flex gap-4">
        {!artworkPreview ? (
          <div className="flex-1">
            <Input
              id="artwork"
              name="artwork_uri"
              type="file"
              accept="image/*"
              required={!artworkPreview}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            aria-label="Change artwork"
            className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-md transition-all duration-100 hover:opacity-75 active:scale-95"
            onClick={handleClick}
          >
            <Image
              src={artworkPreview}
              alt="Artwork preview"
              fill
              className="rounded-[8px] object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all hover:bg-black/70 hover:opacity-100">
              <span className="text-sm">Change Image</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
