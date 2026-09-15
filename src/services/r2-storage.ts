// R2 Storage Service for ONEX ERP
// Handles file uploads, downloads, and management

import { Env, R2FileMetadata, R2UploadOptions, ApiResponse } from '../types';

export class R2StorageService {
  private bucket: R2Bucket;
  private env: Env;

  constructor(env: Env) {
    this.bucket = env.R2_STORAGE;
    this.env = env;
  }

  /**
   * Upload file to R2 storage
   */
  async uploadFile(
    key: string,
    file: ArrayBuffer | ReadableStream<Uint8Array>,
    options?: R2UploadOptions
  ): Promise<ApiResponse<R2FileMetadata>> {
    try {
      const object = await this.bucket.put(key, file, {
        httpMetadata: {
          contentType: options?.contentType || 'application/octet-stream',
          contentDisposition: options?.contentDisposition,
        },
        customMetadata: options?.customMetadata,
      });

      return {
        success: true,
        data: {
          key: object.key,
          size: object.size,
          etag: object.etag,
          customMetadata: object.customMetadata,
          httpMetadata: object.httpMetadata,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Upload invoice document
   */
  async uploadInvoice(
    invoiceNumber: string,
    type: 'sales' | 'purchase',
    file: ArrayBuffer,
    filename: string
  ): Promise<ApiResponse<R2FileMetadata>> {
    const key = `invoices/${type}/${invoiceNumber}/${filename}`;
    return this.uploadFile(key, file, {
      contentType: 'application/pdf',
      customMetadata: {
        invoiceNumber,
        invoiceType: type,
        uploadedAt: new Date().toISOString(),
      },
    });
  }

  /**
   * Upload attachment (image, document, etc.)
   */
  async uploadAttachment(
    recordType: string,
    recordId: string,
    file: ArrayBuffer,
    filename: string,
    contentType: string
  ): Promise<ApiResponse<R2FileMetadata>> {
    const key = `attachments/${recordType}/${recordId}/${filename}`;
    return this.uploadFile(key, file, {
      contentType,
      customMetadata: {
        recordType,
        recordId,
        originalFilename: filename,
      },
    });
  }

  /**
   * Download file from R2
   */
  async downloadFile(key: string): Promise<Response | null> {
    try {
      const object = await this.bucket.get(key);
      if (!object) {
        return null;
      }
      return new Response(object.body, {
        headers: {
          'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
          'Content-Length': object.size.toString(),
        },
      });
    } catch (error) {
      console.error(`Failed to download file ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete file from R2
   */
  async deleteFile(key: string): Promise<ApiResponse<void>> {
    try {
      await this.bucket.delete(key);
      return {
        success: true,
        message: `File ${key} deleted successfully`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * List files in a directory
   */
  async listFiles(prefix: string, limit: number = 100): Promise<ApiResponse<R2FileMetadata[]>> {
    try {
      const list = await this.bucket.list({ prefix, limit });
      const files: R2FileMetadata[] = list.objects.map((obj) => ({
        key: obj.key,
        size: obj.size,
        etag: obj.etag,
        customMetadata: obj.customMetadata,
        httpMetadata: obj.httpMetadata,
      }));

      return {
        success: true,
        data: files,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'List operation failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string): Promise<ApiResponse<R2FileMetadata>> {
    try {
      const object = await this.bucket.head(key);
      if (!object) {
        return {
          success: false,
          error: `File ${key} not found`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: true,
        data: {
          key: object.key,
          size: object.size,
          etag: object.etag,
          customMetadata: object.customMetadata,
          httpMetadata: object.httpMetadata,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Metadata retrieval failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Copy file within R2
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<ApiResponse<R2FileMetadata>> {
    try {
      const object = await this.bucket.copy(sourceKey, destinationKey);
      return {
        success: true,
        data: {
          key: object.key,
          size: object.size,
          etag: object.etag,
          customMetadata: object.customMetadata,
          httpMetadata: object.httpMetadata,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Copy operation failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Generate presigned URL for temporary access
   * Note: This would require using Cloudflare's S3 API directly
   */
  async generatePresignedUrl(key: string, expirySeconds: number = 3600): Promise<string> {
    // This is a placeholder - implement using Cloudflare's S3 API
    // For now, return a basic URL structure
    return `https://${this.env.R2_ACCESS_KEY_ID}.r2.cloudflarestorage.com/${key}?expires=${Date.now() + expirySeconds * 1000}`;
  }

  /**
   * Backup invoice to R2
   */
  async backupInvoice(invoiceNumber: string, data: string): Promise<ApiResponse<R2FileMetadata>> {
    const key = `backups/invoices/${new Date().toISOString().split('T')[0]}/${invoiceNumber}.json`;
    return this.uploadFile(key, new TextEncoder().encode(data), {
      contentType: 'application/json',
      customMetadata: {
        invoiceNumber,
        backupDate: new Date().toISOString(),
      },
    });
  }

  /**
   * Archive old invoices
   */
  async archiveInvoices(fiscalYear: number): Promise<ApiResponse<number>> {
    try {
      const prefix = `invoices/sales/${fiscalYear}/`;
      const list = await this.bucket.list({ prefix, limit: 1000 });

      const archivePrefix = `archive/${fiscalYear}/`;
      let count = 0;

      for (const obj of list.objects) {
        const newKey = obj.key.replace(prefix, archivePrefix);
        await this.copyFile(obj.key, newKey);
        await this.deleteFile(obj.key);
        count++;
      }

      return {
        success: true,
        data: count,
        message: `Archived ${count} invoices for fiscal year ${fiscalYear}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Archive operation failed',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<ApiResponse<{ totalFiles: number; totalSize: number }>> {
    try {
      let totalFiles = 0;
      let totalSize = 0;
      let cursor: string | undefined;

      // Iterate through all objects to calculate total
      do {
        const list = await this.bucket.list({ cursor });
        totalFiles += list.objects.length;
        totalSize += list.objects.reduce((sum, obj) => sum + obj.size, 0);
        cursor = list.cursor;
      } while (cursor);

      return {
        success: true,
        data: { totalFiles, totalSize },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Stats retrieval failed',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
