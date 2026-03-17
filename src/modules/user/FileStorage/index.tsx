"use client";

import { useState } from "react";
import { uploadFileAction } from "./action";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud, File, AlertCircle } from "lucide-react";

// Form Validation Schema using Zod
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf", 
  "image/jpeg", 
  "image/jpg", 
  "image/png", 
  "image/webp"
];

const fileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }).max(50, { message: "Name cannot exceed 50 characters." }),
  file: z.any()
    .refine((files) => files?.length === 1, "File is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only .pdf, .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

type FileFormValues = z.infer<typeof fileSchema>;

export default function FileUpload({ userId, onSuccess }: { userId: string, onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
  });

  const selectedFile = watch("file");
  const fileNameDisplay = selectedFile && selectedFile.length > 0 ? selectedFile[0].name : null;

  async function onSubmit(data: FileFormValues) {
    setLoading(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("file", data.file[0]);

    try {
      const result = await uploadFileAction(formData, userId);

      if (result.success) {
        // Success
        reset();
        if (onSuccess) onSuccess(); // To trigger list refresh if needed outside, though action has revalidatePath
      } else {
        setServerError(result.error as string);
      }
    } catch (error) {
      setServerError("Something went wrong while uploading the file.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 max-w-2xl mx-auto">
      <div className="p-6 sm:p-8 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex justify-center items-center shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Upload Document</h2>
            <p className="text-sm text-gray-500 mt-0.5">Supports PDF and image files up to 5MB</p>
          </div>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-start text-sm border border-red-100">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <p className="font-medium">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Identity Card, Agreement..."
              disabled={loading}
              className={`w-full px-4 py-3 bg-gray-50/50 border ${errors.name ? 'border-red-300 ring-1 ring-red-200' : 'border-gray-200 hover:border-blue-300'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs font-medium flex items-center mt-1.5">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Select File <span className="text-red-500">*</span>
            </label>
            <div className={`relative group cursor-pointer border-2 border-dashed ${errors.file ? 'border-red-300 bg-red-50/30' : 'border-blue-200 bg-blue-50/30 hover:bg-blue-50/50'} rounded-xl p-8 transition-colors text-center overflow-hidden`}>
              <input
                type="file"
                {...register("file")}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                {fileNameDisplay ? (
                  <>
                    <div className="p-3 bg-white rounded-full shadow-sm text-blue-500 mb-1">
                      <File className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{fileNameDisplay}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">Click or drag to replace</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white rounded-full shadow-sm text-blue-400 mb-1 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag & drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG or WebP (max. 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            {errors.file && (
              <p className="text-red-500 text-xs font-medium flex items-center mt-1.5">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.file.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-400 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex justify-center items-center"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Uploading Document...
              </>
            ) : (
              "Upload and Save"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}