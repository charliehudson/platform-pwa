import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Brain, FileText, TrendingUp, Users, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Policy{' '}
            <span className="text-blue-600 dark:text-blue-400">Pilot</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            AI-powered insurance policy analysis and recommendations. Get intelligent insights, 
            compare coverage, and make informed decisions with our advanced RAG-powered assistant.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/sign-up">
              <Button size="lg" className="btn-primary">
                Get Started Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="btn-outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to understand insurance policies
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our AI-powered platform provides comprehensive analysis, intelligent recommendations, 
              and expert insights to help you navigate the complex world of insurance.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <Brain className="h-5 w-5 flex-none text-blue-600" />
                  AI-Powered Analysis
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Advanced language models analyze policy documents to extract key information, 
                    identify coverage details, and highlight important terms and conditions.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <FileText className="h-5 w-5 flex-none text-blue-600" />
                  Document Intelligence
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Upload policy documents, quotes, and other insurance-related files for 
                    instant analysis and intelligent extraction of relevant information.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <TrendingUp className="h-5 w-5 flex-none text-blue-600" />
                  Smart Recommendations
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Get personalized policy recommendations based on your needs, risk profile, 
                    and coverage requirements with transparent scoring and rationale.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Three simple steps to get intelligent insurance insights
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload your insurance policies, quotes, or any related documents
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>
                    Our AI processes and analyzes your documents for key insights
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <CardTitle>Get Insights</CardTitle>
                  <CardDescription>
                    Receive comprehensive analysis, recommendations, and answers to your questions
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Join thousands of users who are already making smarter insurance decisions 
              with the power of AI.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/sign-up">
                <Button size="lg" className="btn-primary">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/auth/sign-in">
                <Button variant="outline" size="lg" className="btn-outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Policy Pilot</h3>
              <p className="text-gray-400 text-sm">
                AI-powered insurance policy analysis and recommendations platform. 
                Get intelligent insights to make informed insurance decisions.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-center text-sm text-gray-400">
              © 2024 Policy Pilot. All rights reserved.
            </p>
            <p className="text-center text-xs text-gray-500 mt-2">
              This tool provides AI-assisted, generalized policy insights. It is not financial advice. 
              Always read the policy documents and consult a qualified advisor.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
