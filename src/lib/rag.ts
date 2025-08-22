import { prisma } from './db'
import { aiService } from './ai'
import { storageService } from './storage'
import { z } from 'zod'
import { PolicyChunk } from '@prisma/client'

export interface RAGSearchResult {
  id: string
  content: string
  score: number
  metadata: {
    insurer: string
    product: string
    version?: string
    sourceUrl?: string
  }
}

export interface RAGIngestionJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  totalItems: number
  processedItems: number
  errors: string[]
  createdAt: Date
  updatedAt: Date
}

export class RAGService {
  private chunkSize = 800
  private chunkOverlap = 120

  async ingestPolicyDocuments(
    items: string[],
    source: 'upload' | 'url',
    metadata?: {
      insurer?: string
      product?: string
      version?: string
      sourceUrl?: string
    }
  ): Promise<string> {
    const jobId = `ingest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create ingestion job record
    // In a real implementation, this would be stored in the database
    
    // Process documents asynchronously
    this.processDocumentsAsync(jobId, items, source, metadata)
    
    return jobId
  }

  private async processDocumentsAsync(
    jobId: string,
    items: string[],
    source: 'upload' | 'url',
    metadata?: any
  ) {
    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        
        // Fetch document content
        let content: string
        if (source === 'url') {
          content = await this.fetchDocumentFromUrl(item)
        } else {
          content = await this.fetchDocumentFromStorage(item)
        }

        // Parse and chunk document
        const chunks = this.chunkDocument(content)
        
        // Generate embeddings for chunks
        const embeddings = await aiService.generateEmbeddings(chunks)
        
        // Store chunks in database
        await this.storePolicyChunks(chunks, embeddings, metadata)
        
        // Update progress
        const progress = ((i + 1) / items.length) * 100
        console.log(`Ingestion progress: ${progress.toFixed(1)}%`)
      }
      
      console.log(`Ingestion job ${jobId} completed successfully`)
    } catch (error) {
      console.error(`Ingestion job ${jobId} failed:`, error)
    }
  }

  private async fetchDocumentFromUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url)
      const text = await response.text()
      return text
    } catch (error) {
      console.error('Error fetching document from URL:', error)
      throw new Error('Failed to fetch document from URL')
    }
  }

  private async fetchDocumentFromStorage(key: string): Promise<string> {
    try {
      // This would fetch from S3/MinIO and parse the document
      // For now, return a placeholder
      return `Document content from ${key}`
    } catch (error) {
      console.error('Error fetching document from storage:', error)
      throw new Error('Failed to fetch document from storage')
    }
  }

  private chunkDocument(content: string): string[] {
    const chunks: string[] = []
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    let currentChunk = ''
    let currentTokens = 0
    
    for (const sentence of sentences) {
      const sentenceTokens = this.estimateTokens(sentence)
      
      if (currentTokens + sentenceTokens > this.chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
        currentChunk = sentence
        currentTokens = sentenceTokens
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence
        currentTokens += sentenceTokens
      }
    }
    
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }
    
    return chunks
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  private   async storePolicyChunks(
    chunks: string[],
    embeddings: number[][],
    metadata: any
  ): Promise<void> {
    try {
      // TODO: Implement vector storage when pgvector is properly configured
      console.log('Vector storage not yet implemented')
      // for (let i = 0; i < chunks.length; i++) {
      //   const chunk = chunks[i]
      //   const embedding = embeddings[i]
      //   
      //   await prisma.policyChunk.create({
      //     data: {
      //       insurer: metadata?.insurer || 'Unknown',
      //       product: metadata?.product || 'Unknown',
      //       version: metadata?.version,
      //       sourceUrl: metadata?.sourceUrl,
      //       content: chunk,
      //       tokens: this.estimateTokens(chunk),
      //       embedding: embedding as any, // Type assertion for pgvector
      //       metadata: metadata,
      //     },
      //   })
      // }
    } catch (error) {
      console.error('Error storing policy chunks:', error)
      throw new Error('Failed to store policy chunks')
    }
  }

  async searchRelevant(
    query: string,
    context?: any,
    topK: number = 10
  ): Promise<RAGSearchResult[]> {
    try {
      // TODO: Implement vector search when pgvector is properly configured
      console.log('Vector search not yet implemented')
      return []
      
      // Generate embedding for query
      // const queryEmbedding = await aiService.generateEmbedding(query)
      // 
      // Search for similar chunks using vector similarity
      // const chunks = await prisma.policyChunk.findMany({
      //   take: topK,
      //   orderBy: {
      //     // This would use pgvector's similarity function
      //     // For now, we'll order by creation date
      //     createdAt: 'desc'
      //   },
      //   where: {
      //     // Add filters based on context if provided
      //     ...(context?.insurer && { insurer: context.insurer }),
      //       ...(context?.product && { product: context.product }),
      //   }
      // })
      // 
      // In a real implementation with pgvector, you would use:
      // SELECT *, embedding <-> $1 as distance FROM policy_chunks ORDER BY distance LIMIT $2
      // 
      // For now, return chunks with mock similarity scores
      // return chunks.map((chunk, index) => ({
      //   id: chunk.id,
      //   content: chunk.content,
      //   score: 1.0 - (index * 0.1), // Mock similarity score
      //   metadata: {
      //     insurer: chunk.insurer,
      //     product: chunk.product,
      //     version: chunk.version || undefined,
      //     sourceUrl: chunk.sourceUrl || undefined,
      //   }
      // }))
    } catch (error) {
      console.error('Error searching relevant chunks:', error)
      throw new Error('Failed to search relevant chunks')
    }
  }

  async generateAnswer(
    query: string,
    requestContext?: any,
    topK: number = 10
  ): Promise<{ content: string; citations: any[]; confidence: number }> {
    try {
      // Search for relevant context
      const searchResults = await this.searchRelevant(query, requestContext, topK)
      
      // Extract content from search results
      const context = searchResults.map(result => result.content)
      
      // Generate RAG response
      const response = await aiService.generateRAGResponse(query, context, requestContext)
      
      // Map citations to actual search results
      const mappedCitations = response.citations.map(citation => {
        const searchResult = searchResults[citation.index]
        return {
          ...citation,
          content: searchResult?.content || '',
          metadata: searchResult?.metadata || {},
        }
      })
      
      return {
        content: response.content,
        citations: mappedCitations,
        confidence: response.confidence,
      }
    } catch (error) {
      console.error('Error generating answer:', error)
      throw new Error('Failed to generate answer')
    }
  }

  async getIngestionJobStatus(jobId: string): Promise<RAGIngestionJob | null> {
    // In a real implementation, this would query the database
    // For now, return a mock status
    return {
      id: jobId,
      status: 'completed',
      progress: 100,
      totalItems: 1,
      processedItems: 1,
      errors: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  async deletePolicyChunks(filters: {
    insurer?: string
    product?: string
    version?: string
  }): Promise<number> {
    try {
      const result = await prisma.policyChunk.deleteMany({
        where: filters,
      })
      
      return result.count
    } catch (error) {
      console.error('Error deleting policy chunks:', error)
      throw new Error('Failed to delete policy chunks')
    }
  }

  async getPolicyChunksStats(): Promise<{
    total: number
    byInsurer: Record<string, number>
    byProduct: Record<string, number>
  }> {
    try {
      const total = await prisma.policyChunk.count()
      
      const byInsurer = await prisma.policyChunk.groupBy({
        by: ['insurer'],
        _count: true,
      })
      
      const byProduct = await prisma.policyChunk.groupBy({
        by: ['product'],
        _count: true,
      })
      
      return {
        total,
        byInsurer: Object.fromEntries(
          byInsurer.map(item => [item.insurer, item._count])
        ),
        byProduct: Object.fromEntries(
          byProduct.map(item => [item.product, item._count])
        ),
      }
    } catch (error) {
      console.error('Error getting policy chunks stats:', error)
      throw new Error('Failed to get policy chunks stats')
    }
  }
}

export const ragService = new RAGService()
