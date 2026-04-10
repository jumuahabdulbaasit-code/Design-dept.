import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db, storage, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/src/lib/AuthContext';
import { Loader2, Upload, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';

interface PostDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDesignModal({ isOpen, onClose }: PostDesignModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    // Auto-fill title if empty
    if (!title) {
      const fileName = selectedFile.name.split('.')[0];
      setTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1).replace(/[-_]/g, ' '));
    }
  }, [title]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: false,
  } as any);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `designs/${user.uid}/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      // 2. Save to Firestore
      await addDoc(collection(db, 'designs'), {
        title: title || 'Untitled Design',
        imageUrl: downloadUrl,
        authorId: user.uid,
        authorName: user.displayName || user.email?.split('@')[0],
        authorPhoto: user.photoURL,
        createdAt: serverTimestamp(),
        likes: 0
      });
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload design. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setFile(null);
    setPreview(null);
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Showcase Your Design</DialogTitle>
          <DialogDescription>
            Drop your design here to share it with the community.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold">Design Posted!</h3>
            <p className="text-muted-foreground">Your work is now live in the showcase.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {!preview ? (
              <div
                {...getRootProps()}
                className={`
                  aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer
                  flex flex-col items-center justify-center p-8 text-center
                  ${isDragActive ? "border-primary bg-primary/5 scale-[0.98]" : "border-border hover:border-primary/50 hover:bg-muted"}
                `}
              >
                <input {...getInputProps()} />
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Drop your design here</h3>
                <p className="text-muted-foreground text-xs">
                  PNG, JPG, or WebP up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-border group">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button 
                  type="button"
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Design Title (Optional)</Label>
              <Input 
                id="title" 
                placeholder="Give your work a name..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={loading || !file} className="gap-2 min-w-[120px]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {loading ? "Uploading..." : "Post Design"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
