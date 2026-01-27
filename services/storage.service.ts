"use server"
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// ============================================================================
// TYPES
// ============================================================================

export interface UploadResult {
  success: boolean;
  data?: {
    publicId: string;
    uniqueId: string;
    url: string;
    secureUrl: string;
    fileName: string;
    format: string;
    size: number;
    width?: number;
    height?: number;
  };
  error?: string;
}

export interface FileInput {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

let isConfigured = false;

function ensureConfigured(): void {
  if (isConfigured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary configuration missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  isConfigured = true;
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class StorageService {
  private readonly folder: string;

  constructor(folder: string = "dss-loan-uploads") {
    ensureConfigured();
    this.folder = folder;
  }

  /**
   * Upload a file to Cloudinary
   */
  async uploadFile(
    file: FileInput,
    subfolder?: string
  ): Promise<UploadResult> {
    const targetFolder = subfolder ? `${this.folder}/${subfolder}` : this.folder;
    const publicId = `${Date.now()}-${file.originalname.split(".")[0]}`;

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: targetFolder,
          resource_type: "auto",
          public_id: publicId,
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve({
              success: false,
              error: error.message || "Upload failed",
            });
            return;
          }

          if (!result) {
            resolve({
              success: false,
              error: "No result returned from Cloudinary",
            });
            return;
          }

          resolve({
            success: true,
            data: {
              publicId: result.public_id,
              uniqueId: result.asset_id,
              url: result.url,
              secureUrl: result.secure_url,
              fileName: file.originalname,
              format: result.format,
              size: result.bytes,
              width: result.width,
              height: result.height,
            },
          });
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  /**
   * Upload multiple files to Cloudinary
   */
  async uploadMultipleFiles(
    files: FileInput[],
    subfolder?: string
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, subfolder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from Cloudinary by public_id
   */
  async deleteFile(publicId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error("Cloudinary delete error:", error);
          resolve({
            success: false,
            error: error.message || "Delete failed",
          });
          return;
        }

        resolve({
          success: result?.result === "ok",
          error: result?.result !== "ok" ? "File not found or already deleted" : undefined,
        });
      });
    });
  }

  /**
   * Delete multiple files from Cloudinary
   */
  async deleteMultipleFiles(
    publicIds: string[]
  ): Promise<{ success: boolean; deleted: string[]; failed: string[] }> {
    const deleted: string[] = [];
    const failed: string[] = [];

    for (const publicId of publicIds) {
      const result = await this.deleteFile(publicId);
      if (result.success) {
        deleted.push(publicId);
      } else {
        failed.push(publicId);
      }
    }

    return {
      success: failed.length === 0,
      deleted,
      failed,
    };
  }

  /**
   * Get a signed URL for a private resource
   */
  getSignedUrl(publicId: string, expiresInSeconds: number = 3600): string {
    ensureConfigured();
    return cloudinary.url(publicId, {
      sign_url: true,
      type: "authenticated",
      expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    });
  }

  /**
   * Generate a transformation URL
   */
  getTransformedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: number | string;
      format?: string;
    }
  ): string {
    ensureConfigured();
    return cloudinary.url(publicId, {
      transformation: [
        {
          width: options.width,
          height: options.height,
          crop: options.crop || "fill",
          quality: options.quality || "auto",
          fetch_format: options.format || "auto",
        },
      ],
    });
  }
}

// ============================================================================
// SINGLETON INSTANCES FOR DIFFERENT UPLOAD CONTEXTS
// ============================================================================

export const storageService = new StorageService();
export const kycStorage = new StorageService("dss-loan-uploads/kyc");
export const loanDocStorage = new StorageService("dss-loan-uploads/loan-documents");
export const profileStorage = new StorageService("dss-loan-uploads/profiles");

// ============================================================================
// HELPER FUNCTIONS FOR SERVER ACTIONS / API ROUTES
// ============================================================================

/**
 * Convert a File (from FormData) to FileInput format
 */
export async function fileToInput(file: File): Promise<FileInput> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return {
    buffer,
    originalname: file.name,
    mimetype: file.type,
    size: file.size,
  };
}

/**
 * Upload a file from FormData (for use in Server Actions)
 */
export async function uploadFromFormData(
  formData: FormData,
  fieldName: string,
  subfolder?: string
): Promise<UploadResult> {
  const file = formData.get(fieldName) as File | null;

  if (!file || !(file instanceof File)) {
    return {
      success: false,
      error: `No file found for field: ${fieldName}`,
    };
  }

  const fileInput = await fileToInput(file);
  return storageService.uploadFile(fileInput, subfolder);
}

/**
 * Upload multiple files from FormData
 */
export async function uploadMultipleFromFormData(
  formData: FormData,
  fieldName: string,
  subfolder?: string
): Promise<UploadResult[]> {
  const files = formData.getAll(fieldName) as File[];

  if (!files || files.length === 0) {
    return [{ success: false, error: `No files found for field: ${fieldName}` }];
  }

  const fileInputs = await Promise.all(
    files.filter((f) => f instanceof File).map(fileToInput)
  );

  return storageService.uploadMultipleFiles(fileInputs, subfolder);
}
