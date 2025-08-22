import AWS from 'aws-sdk'
import { z } from 'zod'

const s3Config = {
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  s3ForcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  signatureVersion: 'v4',
}

export const s3 = new AWS.S3(s3Config)

export class StorageService {
  private bucket: string

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'insurance-copilot'
  }

  async createSignedUploadUrl(key: string, contentType: string, expiresIn: number = 3600): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
      Expires: expiresIn,
    }

    try {
      const url = await s3.getSignedUrlPromise('putObject', params)
      return url
    } catch (error) {
      console.error('Error creating signed upload URL:', error)
      throw new Error('Failed to create upload URL')
    }
  }

  async createSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Expires: expiresIn,
    }

    try {
      const url = await s3.getSignedUrlPromise('getObject', params)
      return url
    } catch (error) {
      console.error('Error creating signed download URL:', error)
      throw new Error('Failed to create download URL')
    }
  }

  async uploadFile(key: string, file: Buffer, contentType: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: {
        uploadedAt: new Date().toISOString(),
      },
    }

    try {
      await s3.upload(params).promise()
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    }

    try {
      await s3.deleteObject(params).promise()
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error('Failed to delete file')
    }
  }

  async fileExists(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    }

    try {
      await s3.headObject(params).promise()
      return true
    } catch (error) {
      return false
    }
  }

  async getFileMetadata(key: string): Promise<AWS.S3.HeadObjectOutput | null> {
    const params = {
      Bucket: this.bucket,
      Key: key,
    }

    try {
      const metadata = await s3.headObject(params).promise()
      return metadata
    } catch (error) {
      console.error('Error getting file metadata:', error)
      return null
    }
  }

  generateKey(requestId: string, filename: string): string {
    const timestamp = Date.now()
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    return `requests/${requestId}/${timestamp}_${sanitizedFilename}`
  }

  async ensureBucketExists(): Promise<void> {
    try {
      await s3.headBucket({ Bucket: this.bucket }).promise()
    } catch (error) {
      try {
        await s3.createBucket({ Bucket: this.bucket }).promise()
        console.log(`Bucket ${this.bucket} created successfully`)
      } catch (createError) {
        console.error('Error creating bucket:', createError)
        throw new Error('Failed to create bucket')
      }
    }
  }
}

export const storageService = new StorageService()
