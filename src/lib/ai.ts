import OpenAI from 'openai'
import { OpenAIEmbeddings } from '@langchain/openai'
import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'

export interface LLMProvider {
  chat: ChatOpenAI
  embeddings: OpenAIEmbeddings
}

export class AIService {
  private provider: LLMProvider
  private model: string
  private embeddingsModel: string

  constructor() {
    this.model = process.env.LLM_MODEL || 'gpt-4-turbo-preview'
    this.embeddingsModel = process.env.EMBEDDINGS_MODEL || 'text-embedding-3-large'
    
    this.provider = this.initializeProvider()
  }

  private initializeProvider(): LLMProvider {
    const provider = process.env.LLM_PROVIDER || 'openai'
    
    switch (provider) {
      case 'openai':
        return this.initializeOpenAI()
      case 'azure':
        return this.initializeAzureOpenAI()
      case 'openrouter':
        return this.initializeOpenRouter()
      default:
        return this.initializeOpenAI()
    }
  }

  private initializeOpenAI(): LLMProvider {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: this.model,
      temperature: 0.1,
      maxTokens: 4000,
    })

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: this.embeddingsModel,
    })

    return { chat, embeddings }
  }

  private initializeAzureOpenAI(): LLMProvider {
    // For now, use basic OpenAI configuration
    // Azure OpenAI configuration needs to be properly configured
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      modelName: this.model,
      temperature: 0.1,
      maxTokens: 4000,
    })

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.AZURE_OPENAI_API_KEY,
      modelName: this.embeddingsModel,
    })

    return { chat, embeddings }
  }

  private initializeOpenRouter(): LLMProvider {
    // For now, use basic OpenAI configuration
    // OpenRouter configuration needs to be properly configured
    const chat = new ChatOpenAI({
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      modelName: this.model,
      temperature: 0.1,
      maxTokens: 4000,
    })

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      modelName: this.embeddingsModel,
    })

    return { chat, embeddings }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const embedding = await this.provider.embeddings.embedQuery(text)
      return embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      throw new Error('Failed to generate embedding')
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const embeddings = await this.provider.embeddings.embedDocuments(texts)
      return embeddings
    } catch (error) {
      console.error('Error generating embeddings:', error)
      throw new Error('Failed to generate embeddings')
    }
  }

  async chatCompletion(messages: any[], options?: { temperature?: number; maxTokens?: number }) {
    try {
      const response = await this.provider.chat.invoke(messages)
      return response
    } catch (error) {
      console.error('Error in chat completion:', error)
      throw new Error('Failed to generate chat completion')
    }
  }

  async streamChatCompletion(messages: any[], options?: { temperature?: number; maxTokens?: number }) {
    try {
      const stream = await this.provider.chat.stream(messages)
      return stream
    } catch (error) {
      console.error('Error in streaming chat completion:', error)
      throw new Error('Failed to generate streaming chat completion')
    }
  }

  // RAG-specific methods
  async generateRAGResponse(
    query: string,
    context: string[],
    requestContext?: any
  ): Promise<{ content: string; citations: any[]; confidence: number }> {
    const systemPrompt = this.buildRAGSystemPrompt(requestContext)
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: this.buildRAGUserPrompt(query, context) }
    ]

    try {
      const response = await this.chatCompletion(messages)
      const content = response.content as string
      
      // Extract citations and confidence from response
      const citations = this.extractCitations(content)
      const confidence = this.extractConfidence(content)
      
      return {
        content: this.cleanResponse(content),
        citations,
        confidence
      }
    } catch (error) {
      console.error('Error generating RAG response:', error)
      throw new Error('Failed to generate RAG response')
    }
  }

  private buildRAGSystemPrompt(requestContext?: any): string {
    return `You are an expert insurance policy analyst. Your role is to provide accurate, helpful information about insurance policies based on the provided context.

IMPORTANT RULES:
1. NEVER fabricate or guess prices, premiums, or specific monetary amounts unless they are explicitly stated in the context
2. If information is not available in the context, say "This information is not available in the provided policy documents"
3. Always provide citations to specific policy sections when making claims
4. Include a confidence score (0-1) at the end of your response
5. Always include this disclaimer: "This analysis is for informational purposes only and does not constitute financial advice. Please consult with a qualified insurance professional for specific guidance."

Current request context: ${JSON.stringify(requestContext || {})}

Respond in a helpful, professional manner with clear explanations.`
  }

  private buildRAGUserPrompt(query: string, context: string[]): string {
    return `Query: ${query}

Context from policy documents:
${context.map((text, index) => `[${index + 1}] ${text}`).join('\n\n')}

Please provide a comprehensive answer based on the context above. Include specific citations and a confidence score.`
  }

  private extractCitations(content: string): any[] {
    // Simple citation extraction - in production, use more sophisticated parsing
    const citationRegex = /\[(\d+)\]/g
    const citations: any[] = []
    let match
    
    while ((match = citationRegex.exec(content)) !== null) {
      citations.push({
        index: parseInt(match[1]) - 1,
        text: match[0]
      })
    }
    
    return citations
  }

  private extractConfidence(content: string): number {
    // Extract confidence score from response
    const confidenceMatch = content.match(/confidence:\s*([0-9]*\.?[0-9]+)/i)
    if (confidenceMatch) {
      return parseFloat(confidenceMatch[1])
    }
    return 0.7 // Default confidence
  }

  private cleanResponse(content: string): string {
    // Remove confidence score and other metadata from the main response
    return content.replace(/confidence:\s*[0-9]*\.?[0-9]+/gi, '').trim()
  }
}

export const aiService = new AIService()
