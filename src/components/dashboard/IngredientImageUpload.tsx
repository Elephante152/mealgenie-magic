import { useState, type ChangeEvent } from 'react';
import { Camera, Upload, X, Plus } from 'lucide-react';
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
      const event = (e as unknown) as ChangeEvent<HTMLInputElement>;
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
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          className="flex items-center justify-center gap-2 h-12"
        >
          <Upload className="w-5 h-5" />
          <span className="hidden sm:inline">Upload Image</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCameraCapture}
          className="flex items-center justify-center gap-2 h-12"
        >
          <Camera className="w-5 h-5" />
          <span className="hidden sm:inline">Take Photo</span>
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
        <div className="relative rounded-lg overflow-hidden bg-gray-50">
          <img
            src={previewUrl}
            alt="Selected ingredient"
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full"
            onClick={clearImage}
          >
            <X className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            className="mt-2 w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add to Meal Plan
          </Button>
        </div>
      )}
    </div>
  );
};