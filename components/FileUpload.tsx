"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from 'lucide-react';
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video"
}

const onError = (err) => {
  console.log("Error", err);
};

const onSuccess = (res) => {
  console.log("Success", res);
};

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image"
}: FileUploadProps) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onError = (err: {message: string}) => {
        console.log("Error", err);
        setError(err.message)
        setUploading(true);
      };
      
    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false);
        setError(null);
        onSuccess(response);
      };

    const validateFile = (file: File) => {
        if (fileType === "video") {
            if (!file.type.startsWith("video/")){
                setError("Invalid file type. Please upload a video file");
                return false;
            }
            if (file.size > 100 * 1024 * 1024){
                setError("Video must be less than 100MB");
                return false;
            }
        }
        else {
            const validTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validTypes.includes(file.type)){
                setError("Invalid file type. Please upload an image file");
                return false;
            }
            if (file.size > 5 * 1024 * 1024){
                setError("Video must be less than 5MB");
                return false;
            }
        }
        return false;
    }

  return (
    <div className="App">
      <h1>ImageKit Next.js quick start</h1>
        <div>
          <h2>File upload</h2>
          <IKUpload fileName={fileType === "video" ? "video" : "Image"} 
                    onError={onError} 
                    onSuccess={handleSuccess} 
                    useUniqueFileName={true} 
                    validateFile={validateFile} 
                    folder={fileType === "image" ? '/images' : '/videos'}
                    className="file-input file-input-bordered w-full"
                    />
        </div>
        {
            uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4"/>
                    <span>Uploading...</span>
                </div>
            )
        }
        {
            error && (
                <div className="text-error text-sm ">{error}</div>
            )
        }
    </div>
  );
}