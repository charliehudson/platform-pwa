'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Edit, FileText, Clock, CheckCircle, AlertCircle, Archive, Download, Eye, MessageSquare, Send, User } from 'lucide-react'
import Link from 'next/link'

interface InsuranceRequest {
  id: string
  type: 'HOME' | 'CAR' | 'LIFE' | 'TRAVEL' | 'GADGET'
  status: 'DRAFT' | 'SUBMITTED' | 'NEEDS_INFO' | 'IN_REVIEW' | 'READY' | 'ARCHIVED'
  title: string
  description: string
  createdAt: Date
  updatedAt: Date
  documentsCount: number
  estimatedPremium?: number
  details?: Record<string, any>
  recommendedPolicies?: RecommendedPolicy[]
}

interface RecommendedPolicy {
  id: string
  insurer: string
  productName: string
  premium: number
  coverage: string
  deductible: number
  rating: number
  reasons: string[]
  pros: string[]
  cons: string[]
  policyUrl?: string
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  citations?: Array<{
    source: string
    page?: number
    confidence: number
  }>
}

const requestTypes = {
  HOME: { label: 'Home Insurance', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  CAR: { label: 'Auto Insurance', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  LIFE: { label: 'Life Insurance', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  TRAVEL: { label: 'Travel Insurance', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  GADGET: { label: 'Gadget Insurance', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
}

const statusConfig = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: FileText },
  SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: Clock },
  NEEDS_INFO: { label: 'Needs Info', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: AlertCircle },
  IN_REVIEW: { label: 'In Review', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: Clock },
  READY: { label: 'Ready', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: Archive },
}

export default function ViewRequestPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [request, setRequest] = useState<InsuranceRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)

  const requestId = params.id as string

  useEffect(() => {
    if (session?.user && requestId) {
      loadRequest()
    }
  }, [session, requestId])

  const loadRequest = async () => {
    try {
      // Mock data - replace with actual API call
      const mockRequest: InsuranceRequest = {
        id: requestId,
        type: 'HOME',
        status: 'READY',
        title: 'Home Insurance Renewal',
        description: 'Annual renewal for 3-bedroom house in New York. Looking for comprehensive coverage including natural disasters and liability protection.',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        documentsCount: 5,
        estimatedPremium: 1200,
        details: {
          propertyType: 'House',
          bedrooms: 3,
          bathrooms: 2.5,
          squareFootage: 2200,
          yearBuilt: 2010,
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        },
        recommendedPolicies: [
          {
            id: '1',
            insurer: 'State Farm',
            productName: 'Homeowners Plus',
            premium: 1150,
            coverage: 'Comprehensive',
            deductible: 1000,
            rating: 4.8,
            reasons: [
              'Best coverage-to-price ratio for your property type',
              'Excellent natural disaster protection',
              'High customer satisfaction ratings',
              'Comprehensive liability coverage'
            ],
            pros: [
              'Lower premium than average',
              '24/7 claims support',
              'Bundle discounts available',
              'High coverage limits'
            ],
            cons: [
              'Higher deductible than some competitors',
              'Limited online tools'
            ],
            policyUrl: 'https://statefarm.com/homeowners-plus'
          },
          {
            id: '2',
            insurer: 'Allstate',
            productName: 'Good Neighbor',
            premium: 1280,
            coverage: 'Comprehensive',
            deductible: 750,
            rating: 4.6,
            reasons: [
              'Strong financial stability',
              'Good natural disaster coverage',
              'Competitive pricing for your area',
              'Excellent customer service'
            ],
            pros: [
              'Lower deductible option',
              'Advanced digital tools',
              'Good claims experience',
              'Multiple coverage options'
            ],
            cons: [
              'Slightly higher premium',
              'Limited agent network in your area'
            ],
            policyUrl: 'https://allstate.com/good-neighbor'
          },
          {
            id: '3',
            insurer: 'Liberty Mutual',
            productName: 'Custom Home',
            premium: 1220,
            coverage: 'Comprehensive',
            deductible: 1000,
            rating: 4.4,
            reasons: [
              'Customizable coverage options',
              'Good value for money',
              'Strong financial ratings',
              'Comprehensive protection'
            ],
            pros: [
              'Flexible coverage options',
              'Good online experience',
              'Competitive pricing',
              'Strong financial backing'
            ],
            cons: [
              'Standard deductible',
              'Limited local presence'
            ],
            policyUrl: 'https://libertymutual.com/custom-home'
          }
        ]
      }

      setRequest(mockRequest)
    } catch (error) {
      toast.error('Failed to load request details')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const IconComponent = statusConfig[status].icon
    return <IconComponent className="h-4 w-4" />
  }

  const handleEditRequest = () => {
    toast.success('Edit functionality coming soon!')
  }

  const handleDownloadDocument = (documentId: string) => {
    toast.success(`Downloading document ${documentId}`)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isChatLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsChatLoading(true)

    try {
      // Mock AI response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (!request) {
        toast.error('Request not found')
        return
      }
      
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockChatResponse(chatInput, request),
        timestamp: new Date(),
        citations: [
          {
            source: 'Insurance Policy Analysis',
            page: Math.floor(Math.random() * 20) + 1,
            confidence: 0.85 + Math.random() * 0.1,
          }
        ],
      }

      setChatMessages(prev => [...prev, aiResponse])
    } catch (error) {
      toast.error('Failed to get AI response')
    } finally {
      setIsChatLoading(false)
    }
  }

  const generateMockChatResponse = (question: string, request: InsuranceRequest): string => {
    const responses = [
      `Based on your ${request.type.toLowerCase()} insurance request, I can provide detailed insights about the recommended policies and coverage options.`,
      `Great question! Let me analyze your specific situation and the policy recommendations to give you the best advice.`,
      `I've reviewed your request details and the available policies. Here's what I found regarding your question.`,
      `Excellent question about your insurance needs. Let me break down the policy recommendations and explain why these options are best for you.`,
    ]
    
    return responses[Math.floor(Math.random() * responses.length)] + ' ' +
           'This is a mock response for demonstration purposes. In the real application, this would be generated by the AI based on your actual request details and policy analysis.'
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view requests</h2>
          <Button asChild>
            <a href="/auth/sign-in">Sign In</a>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Request Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The request you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard/requests">
            <Button>Back to Requests</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/requests">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Requests
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{request.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Request ID: {request.id}
            </p>
          </div>
          {request.status === 'DRAFT' && (
            <Button onClick={handleEditRequest} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>
                  Information about your insurance request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={requestTypes[request.type].color}>
                    {requestTypes[request.type].label}
                  </Badge>
                  <Badge variant="outline" className={statusConfig[request.status].color}>
                    {getStatusIcon(request.status)}
                    {statusConfig[request.status].label}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400">{request.description}</p>
                </div>

                {request.details && Object.keys(request.details).length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Specific Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(request.details).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <p className="text-gray-900 dark:text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

                         {/* Recommended Policies - Only show when status is READY */}
             {request.status === 'READY' && request.recommendedPolicies && (
               <Card>
                 <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                     <CheckCircle className="h-5 w-5 text-green-600" />
                     AI-Recommended Policies
                   </CardTitle>
                   <CardDescription>
                     Based on your request details, here are the best insurance options for you
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-6">
                     {request.recommendedPolicies.map((policy, index) => (
                       <div key={policy.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                         <div className="flex items-start justify-between mb-4">
                           <div>
                             <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                               {policy.productName}
                             </h3>
                             <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                               {policy.insurer}
                             </p>
                           </div>
                           <div className="text-right">
                             <div className="text-2xl font-bold text-gray-900 dark:text-white">
                               ${policy.premium.toLocaleString()}
                             </div>
                             <div className="text-sm text-gray-500 dark:text-gray-400">per year</div>
                           </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                           <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                             <div className="text-sm text-gray-500 dark:text-gray-400">Coverage</div>
                             <div className="font-medium text-gray-900 dark:text-white">{policy.coverage}</div>
                           </div>
                           <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                             <div className="text-sm text-gray-500 dark:text-gray-400">Deductible</div>
                             <div className="font-medium text-gray-900 dark:text-white">${policy.deductible.toLocaleString()}</div>
                           </div>
                           <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                             <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                             <div className="font-medium text-gray-900 dark:text-white">{policy.rating}/5.0</div>
                           </div>
                         </div>

                         <div className="mb-4">
                           <h4 className="font-medium text-gray-900 dark:text-white mb-2">Why This Policy?</h4>
                           <ul className="space-y-1">
                             {policy.reasons.map((reason, i) => (
                               <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                 {reason}
                               </li>
                             ))}
                           </ul>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                           <div>
                             <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Pros</h4>
                             <ul className="space-y-1">
                               {policy.pros.map((pro, i) => (
                                 <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                   {pro}
                                 </li>
                               ))}
                             </ul>
                           </div>
                           <div>
                             <h4 className="font-medium text-orange-700 dark:text-orange-400 mb-2">Cons</h4>
                             <ul className="space-y-1">
                               {policy.cons.map((con, i) => (
                                 <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                   <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                   {con}
                                 </li>
                               ))}
                             </ul>
                           </div>
                         </div>

                         <div className="flex gap-3">
                           <Button className="flex-1">
                             Get Quote
                           </Button>
                           {policy.policyUrl && (
                             <Button variant="outline" asChild>
                               <a href={policy.policyUrl} target="_blank" rel="noopener noreferrer">
                                 View Policy
                               </a>
                             </Button>
                           )}
                         </div>
                       </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}

             {/* AI Chat Interface */}
             <Card>
               <CardHeader>
                 <div className="flex items-center justify-between">
                   <div>
                                             <CardTitle className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5" />
                          AI Policy Assistant
                        </CardTitle>
                        <CardDescription>
                          Ask questions about your request, policies, or get personalized advice
                        </CardDescription>
                   </div>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setShowChat(!showChat)}
                   >
                     {showChat ? 'Hide Chat' : 'Show Chat'}
                   </Button>
                 </div>
               </CardHeader>
               <CardContent>
                 {showChat ? (
                   <div className="space-y-4">
                     {/* Chat Messages */}
                     <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                       {chatMessages.length === 0 ? (
                         <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                           <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                           <p>Start a conversation about your insurance request</p>
                           <p className="text-sm mt-2">Ask about coverage, policies, or get personalized advice</p>
                         </div>
                       ) : (
                         <div className="space-y-4">
                           {chatMessages.map((message) => (
                             <div
                               key={message.id}
                               className={`flex gap-3 ${
                                 message.role === 'user' ? 'justify-end' : 'justify-start'
                               }`}
                             >
                               {message.role === 'assistant' && (
                                 <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                   <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                 </div>
                               )}
                               
                               <div
                                 className={`max-w-[80%] rounded-lg p-3 ${
                                   message.role === 'user'
                                     ? 'bg-blue-600 text-white'
                                     : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                 }`}
                               >
                                 <p className="text-sm">{message.content}</p>
                                 
                                 {message.citations && message.citations.length > 0 && (
                                   <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                                     <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                       Sources:
                                     </p>
                                     {message.citations.map((citation, index) => (
                                       <div key={index} className="text-xs text-gray-600 dark:text-gray-300">
                                         {citation.source} (Page {citation.page}, Confidence: {(citation.confidence * 100).toFixed(0)}%)
                                       </div>
                                     ))}
                                   </div>
                                 )}
                               </div>

                               {message.role === 'user' && (
                                 <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                   <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                 </div>
                               )}
                             </div>
                           ))}
                           
                           {isChatLoading && (
                             <div className="flex gap-3 justify-start">
                               <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                 <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                               </div>
                               <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                                 <div className="flex space-x-1">
                                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                 </div>
                               </div>
                             </div>
                           )}
                         </div>
                       )}
                     </div>

                     {/* Chat Input */}
                     <form onSubmit={handleChatSubmit} className="flex gap-2">
                       <Input
                         value={chatInput}
                         onChange={(e) => setChatInput(e.target.value)}
                         placeholder="Ask about your insurance request, policies, or get advice..."
                         disabled={isChatLoading}
                         className="flex-1"
                       />
                       <Button type="submit" disabled={isChatLoading || !chatInput.trim()}>
                         <Send className="h-4 w-4" />
                       </Button>
                     </form>

                     {/* Quick Questions */}
                     <div className="space-y-2">
                       <p className="text-sm text-gray-500 dark:text-gray-400">Quick questions:</p>
                       <div className="flex flex-wrap gap-2">
                         {[
                           'Why was this policy recommended?',
                           'What coverage do I need?',
                           'How does the deductible work?',
                           'Can I customize this policy?'
                         ].map((question, index) => (
                           <Button
                             key={index}
                             variant="outline"
                             size="sm"
                             onClick={() => setChatInput(question)}
                             className="text-xs"
                           >
                             {question}
                           </Button>
                         ))}
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                     <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                     <p>Click "Show Chat" to start a conversation with our AI assistant</p>
                     <p className="text-sm mt-2">Get personalized advice about your insurance request and policies</p>
                   </div>
                 )}
               </CardContent>
             </Card>

             {/* Documents */}
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <FileText className="h-5 w-5" />
                   Documents ({request.documentsCount})
                 </CardTitle>
                 <CardDescription>
                   Supporting documents for your request
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 {request.documentsCount > 0 ? (
                   <div className="space-y-3">
                     {Array.from({ length: request.documentsCount }, (_, i) => (
                       <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                         <div className="flex items-center gap-3">
                           <FileText className="h-5 w-5 text-gray-400" />
                           <div>
                             <p className="font-medium text-gray-900 dark:text-white">
                               Document {i + 1}.pdf
                             </p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">
                               Uploaded on {request.createdAt.toLocaleDateString()}
                             </p>
                           </div>
                         </div>
                         <div className="flex gap-2">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleDownloadDocument(`doc-${i}`)}
                           >
                             <Download className="h-4 w-4 mr-1" />
                             <MessageSquare className="h-4 w-4" />
                             Download
                           </Button>
                           <Button variant="outline" size="sm">
                             <Eye className="h-4 w-4 mr-1" />
                             View
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                     <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                     <p>No documents uploaded yet</p>
                   </div>
                 )}
               </CardContent>
             </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
                <CardDescription>
                  Track the progress of your request
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Request Created</p>
                      <p className="text-xs text-gray-500">{request.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Submitted for Review</p>
                      <p className="text-xs text-gray-500">{request.updatedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-500">Underwriting Review</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-500">Policy Issued</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

                         {/* Quick Actions */}
             <Card>
               <CardHeader>
                 <CardTitle>Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                 <Button 
                   variant="outline" 
                   className="w-full justify-start"
                   onClick={() => setShowChat(true)}
                 >
                   <MessageSquare className="h-4 w-4 mr-2" />
                   Chat with AI
                 </Button>
                 <Button variant="outline" className="w-full justify-start">
                   <FileText className="h-4 w-4 mr-2" />
                   Download Summary
                 </Button>
                 <Button variant="outline" className="w-full justify-start">
                   <Clock className="h-4 w-4 mr-2" />
                   Check Status
                 </Button>
                 <Button variant="outline" className="w-full justify-start">
                   <AlertCircle className="h-4 w-4 mr-2" />
                   Report Issue
                 </Button>
               </CardContent>
             </Card>

            {/* Request Info */}
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <span className="font-medium">{request.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Updated:</span>
                  <span className="font-medium">{request.updatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Documents:</span>
                  <span className="font-medium">{request.documentsCount}</span>
                </div>
                {request.estimatedPremium && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Est. Premium:</span>
                    <span className="font-medium">${request.estimatedPremium.toLocaleString()}/year</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
