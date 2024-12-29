import { useState, type ChangeEvent } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IngredientImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
}

export const IngredientImageUpload = ({ onImageUploaded }: IngredientImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const event = e as ChangeEvent<HTMLInputElement>;
      handleImageSelect(event);
    };
    input.click();
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      const fileExt = selectedImage.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('ingredient-images')
        .upload(filePath, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ingredient-images')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      toast({
        title: "Image uploaded successfully",
        description: "Your ingredient image has been added to the meal plan generation.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraCapture}
          className="flex-1"
        >
          <Camera className="w-4 h-4 mr-2" />
          Take Photo
        </Button>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {previewUrl && (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Selected ingredient"
            className="w-full h-48 object-cover rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            className="mt-2 w-full"
          >
            Add to Meal Plan
          </Button>
        </div>
      )}
    </div>
  );
};