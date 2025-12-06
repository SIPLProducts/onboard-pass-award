import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import defaultLogo from '@/assets/kpc-learnhub-logo.png';

interface LogoUploadProps {
  collapsed: boolean;
}

export const useLogoUrl = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'sidebar_logo')
        .single();

      if (error) throw error;
      setLogoUrl(data?.value || null);
    } catch (error) {
      console.error('Error fetching logo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  return { logoUrl, loading, refetch: fetchLogo };
};

const LogoUpload = ({ collapsed }: LogoUploadProps) => {
  const { isAdmin } = useAuthContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logoUrl, refetch } = useLogoUrl();

  const handleLogoClick = () => {
    if (isAdmin) {
      setIsDialogOpen(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      // Upload to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `sidebar-logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('branding')
        .getPublicUrl(fileName);

      // Update app_settings
      const { error: updateError } = await supabase
        .from('app_settings')
        .update({ value: urlData.publicUrl, updated_at: new Date().toISOString() })
        .eq('key', 'sidebar_logo');

      if (updateError) throw updateError;

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success('Logo updated successfully!');
      await refetch();
      
      setTimeout(() => {
        setIsDialogOpen(false);
        resetState();
      }, 500);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    try {
      setUploading(true);
      
      const { error } = await supabase
        .from('app_settings')
        .update({ value: null, updated_at: new Date().toISOString() })
        .eq('key', 'sidebar_logo');

      if (error) throw error;

      toast.success('Logo reset to default');
      await refetch();
      setIsDialogOpen(false);
      resetState();
    } catch (error: any) {
      console.error('Reset error:', error);
      toast.error(error.message || 'Failed to reset logo');
    } finally {
      setUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const currentLogo = logoUrl || defaultLogo;

  return (
    <>
      <div
        className="group relative flex h-full w-full cursor-pointer items-center justify-center"
        onClick={handleLogoClick}
      >
        <img
          src={currentLogo}
          alt="KPC LearnHub"
          className={`object-cover transition-all duration-300 hover:opacity-90 ${
            collapsed ? 'h-14 w-auto' : 'h-14 w-full'
          }`}
        />
        
        {/* Admin overlay */}
        {isAdmin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetState();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Sidebar Logo</DialogTitle>
            <DialogDescription>
              Upload a new logo for the sidebar. Recommended size: 200x56 pixels.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current/Preview Logo */}
            <div className="flex justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 p-4">
              <img
                src={previewUrl || currentLogo}
                alt="Logo preview"
                className="h-14 max-w-full object-contain"
              />
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload Button */}
            {!previewUrl && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            )}

            {/* Preview Actions */}
            {previewUrl && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={resetState}
                  disabled={uploading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-center text-sm text-muted-foreground">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            {logoUrl && (
              <Button
                variant="ghost"
                onClick={handleResetToDefault}
                disabled={uploading}
                className="text-muted-foreground"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Default
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoUpload;
