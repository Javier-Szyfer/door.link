import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AudioInputProps {
  audioUri: string;
  onFileSelect: (file: File) => void;
}

export const AudioInput = ({ audioUri, onFileSelect }: AudioInputProps) => {
  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onFileSelect(file);
    };
    input.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="audio">Audio File</Label>
      <div className="flex flex-col gap-4">
        {!audioUri ? (
          <Input
            id="audio"
            name="audio_uri"
            type="file"
            accept="audio/*"
            required={!audioUri}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <audio controls className="w-full">
              <source src={audioUri} type="audio/mpeg" />
              <track kind="captions" />
              Your browser does not support the audio element.
            </audio>
            <button
              type="button"
              onClick={handleClick}
              className="cursor-pointer text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Change audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
