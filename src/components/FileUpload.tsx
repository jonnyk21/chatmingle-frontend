import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FileUploadProps {
  onUpload: (files: File[], collectionData: { name: string; description?: string }) => void;
  maxSize?: number;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxSize = 10,
  accept = '.pdf,.txt,.doc,.docx'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the ${maxSize}MB limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (fileToRemove: File) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const onSubmit = (values: FormValues) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add at least one file to the collection",
        variant: "destructive"
      });
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onUpload(files, {
          name: values.name,
          description: values.description
        });
      }
    }, 100);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Collection Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter collection name" 
                  {...field}
                  className="transition-all duration-200 focus:scale-[1.01]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what this collection contains..."
                  className="resize-none min-h-[100px] transition-all duration-200 focus:scale-[1.01]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-10",
            "transition-all duration-300 ease-in-out",
            "flex flex-col items-center justify-center gap-6",
            isDragging 
              ? "border-primary bg-primary/5 scale-[1.02] shadow-lg" 
              : "border-border hover:border-primary/50 hover:bg-accent/50 hover:scale-[1.01]"
          )}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <Upload className={cn(
              "h-12 w-12 transition-all duration-300",
              isDragging ? "text-primary scale-110" : "text-muted-foreground"
            )} />
            <div>
              <div className="text-xl font-medium mb-2">Drop files here</div>
              <p className="text-sm text-muted-foreground max-w-sm">
                or click to select files from your computer
              </p>
            </div>
          </div>
          
          <input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            className="transition-all duration-200 hover:scale-105"
          >
            Select Files
          </Button>
        </div>

        {files.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg",
                  "bg-card/50 backdrop-blur-sm border shadow-sm",
                  "transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center gap-4">
                  <File className="h-6 w-6 text-primary" />
                  <div>
                    <div className="font-medium mb-1">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2 animate-fade-in">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}

        <Button 
          type="submit" 
          className={cn(
            "w-full transition-all duration-300",
            "hover:scale-[1.02] disabled:hover:scale-100",
            files.length > 0 ? "opacity-100" : "opacity-70"
          )}
          disabled={files.length === 0}
        >
          Create Collection
        </Button>
      </form>
    </Form>
  );
};

export default FileUpload;
