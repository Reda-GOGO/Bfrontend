import { BookImage, CirclePlus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function MediaCard({ formData, setFormData }: any) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("file : ", file);
    if (file) {
      const preview = URL.createObjectURL(file);
      setFormData((prev: any) => ({
        ...prev,
        image: file,
        imagePreview: preview,
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 items-center px-6">
        <Input
          id="imageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {formData.imagePreview ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-full border"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("imageInput")?.click()}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <Label>
            <div
              onClick={() => document.getElementById("imageInput")?.click()}
              className="w-40 rounded-full bg-secondary dark:bg-background h-40 flex items-center justify-center"
            >
              <BookImage />
            </div>
          </Label>
        )}
      </CardContent>
    </Card>
  );
}
