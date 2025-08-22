#!/usr/bin/env tsx

import { Command } from 'commander'
import { ragService } from '../src/lib/rag'
import { storageService } from '../src/lib/storage'
import path from 'path'
import fs from 'fs'

const program = new Command()

program
  .name('ingest')
  .description('Ingest policy documents into the RAG system')
  .version('1.0.0')

program
  .command('upload')
  .description('Ingest documents from local file system')
  .argument('<path>', 'Path to document or directory')
  .option('-i, --insurer <insurer>', 'Insurance company name')
  .option('-p, --product <product>', 'Product type')
  .option('-v, --version <version>', 'Policy version')
  .option('-u, --url <url>', 'Source URL')
  .action(async (filePath: string, options: any) => {
    try {
      console.log('🚀 Starting document ingestion...')
      
      // Ensure storage bucket exists
      await storageService.ensureBucketExists()
      
      const resolvedPath = path.resolve(filePath)
      const stats = fs.statSync(resolvedPath)
      
      if (stats.isFile()) {
        // Single file ingestion
        await ingestSingleFile(resolvedPath, options)
      } else if (stats.isDirectory()) {
        // Directory ingestion
        await ingestDirectory(resolvedPath, options)
      } else {
        console.error('❌ Invalid path provided')
        process.exit(1)
      }
      
      console.log('✅ Document ingestion completed successfully!')
    } catch (error) {
      console.error('❌ Error during ingestion:', error)
      process.exit(1)
    }
  })

program
  .command('url')
  .description('Ingest documents from URLs')
  .argument('<urls...>', 'URLs to ingest')
  .option('-i, --insurer <insurer>', 'Insurance company name')
  .option('-p, --product <product>', 'Product type')
  .option('-v, --version <version>', 'Policy version')
  .action(async (urls: string[], options: any) => {
    try {
      console.log('🚀 Starting URL ingestion...')
      
      const metadata = {
        insurer: options.insurer || 'Unknown',
        product: options.product || 'Unknown',
        version: options.version,
        sourceUrl: urls[0], // Use first URL as source
      }
      
      const jobId = await ragService.ingestPolicyDocuments(urls, 'url', metadata)
      console.log(`📋 Ingestion job started with ID: ${jobId}`)
      
      // Monitor job progress
      await monitorJobProgress(jobId)
      
      console.log('✅ URL ingestion completed successfully!')
    } catch (error) {
      console.error('❌ Error during URL ingestion:', error)
      process.exit(1)
    }
  })

program
  .command('status')
  .description('Check ingestion job status')
  .argument('<jobId>', 'Job ID to check')
  .action(async (jobId: string) => {
    try {
      const status = await ragService.getIngestionJobStatus(jobId)
      if (status) {
        console.log('📊 Job Status:')
        console.log(`  ID: ${status.id}`)
        console.log(`  Status: ${status.status}`)
        console.log(`  Progress: ${status.progress}%`)
        console.log(`  Processed: ${status.processedItems}/${status.totalItems}`)
        if (status.errors.length > 0) {
          console.log(`  Errors: ${status.errors.join(', ')}`)
        }
      } else {
        console.log('❌ Job not found')
      }
    } catch (error) {
      console.error('❌ Error checking job status:', error)
      process.exit(1)
    }
  })

async function ingestSingleFile(filePath: string, options: any) {
  const filename = path.basename(filePath)
  console.log(`📄 Processing file: ${filename}`)
  
  // Read file content
  const fileBuffer = fs.readFileSync(filePath)
  const fileExtension = path.extname(filename).toLowerCase()
  
  // Check if it's a supported document type
  if (!isSupportedDocumentType(fileExtension)) {
    console.warn(`⚠️  Unsupported file type: ${fileExtension}`)
    return
  }
  
  // Generate S3 key
  const s3Key = storageService.generateKey('ingest', filename)
  
  // Upload to storage
  const mimeType = getMimeType(fileExtension)
  await storageService.uploadFile(s3Key, fileBuffer, mimeType)
  
  console.log(`📤 Uploaded to storage: ${s3Key}`)
  
  // Start RAG ingestion
  const metadata = {
    insurer: options.insurer || 'Unknown',
    product: options.product || 'Unknown',
    version: options.version,
    sourceUrl: options.url,
  }
  
  const jobId = await ragService.ingestPolicyDocuments([s3Key], 'upload', metadata)
  console.log(`📋 RAG ingestion job started: ${jobId}`)
  
  return jobId
}

async function ingestDirectory(dirPath: string, options: any) {
  console.log(`📁 Processing directory: ${dirPath}`)
  
  const files = fs.readdirSync(dirPath)
  const supportedFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase()
    return isSupportedDocumentType(ext)
  })
  
  console.log(`📄 Found ${supportedFiles.length} supported files`)
  
  const jobIds: string[] = []
  
  for (const file of supportedFiles) {
    const filePath = path.join(dirPath, file)
    try {
      const jobId = await ingestSingleFile(filePath, options)
      if (jobId) jobIds.push(jobId)
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error)
    }
  }
  
  console.log(`📋 Started ${jobIds.length} ingestion jobs`)
  return jobIds
}

function isSupportedDocumentType(extension: string): boolean {
  const supportedTypes = ['.pdf', '.doc', '.docx', '.txt', '.html', '.htm']
  return supportedTypes.includes(extension)
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.htm': 'text/html',
  }
  return mimeTypes[extension] || 'application/octet-stream'
}

async function monitorJobProgress(jobId: string) {
  console.log('📊 Monitoring job progress...')
  
  let attempts = 0
  const maxAttempts = 30 // 5 minutes with 10-second intervals
  
  while (attempts < maxAttempts) {
    const status = await ragService.getIngestionJobStatus(jobId)
    
    if (status) {
      console.log(`  Progress: ${status.progress}% (${status.processedItems}/${status.totalItems})`)
      
      if (status.status === 'completed') {
        console.log('✅ Job completed successfully!')
        return
      } else if (status.status === 'failed') {
        console.error('❌ Job failed:', status.errors)
        return
      }
    }
    
    attempts++
    await new Promise(resolve => setTimeout(resolve, 10000)) // Wait 10 seconds
  }
  
  console.log('⏰ Job monitoring timeout - check status manually')
}

// Parse command line arguments
program.parse(process.argv)
