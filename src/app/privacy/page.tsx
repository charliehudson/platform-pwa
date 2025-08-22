import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Last updated: January 2024
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Insurance Copilot Privacy Policy</CardTitle>
            <CardDescription>
              How we collect, use, and protect your information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                upload documents, or use our chat features. This may include personal information like 
                your name, email address, and insurance documents.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. How We Use Your Information</h3>
              <p>
                We use your information to provide our services, process your requests, improve our AI models, 
                and communicate with you about your account and our services. We do not sell your personal 
                information to third parties.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3. Document Processing</h3>
              <p>
                When you upload insurance documents, we process them using AI to extract relevant information 
                and provide analysis. Documents are stored securely and processed in accordance with industry 
                security standards.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">4. Data Security</h3>
              <p>
                We implement appropriate security measures to protect your information against unauthorized 
                access, alteration, disclosure, or destruction. This includes encryption, secure servers, 
                and regular security audits.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">5. Data Retention</h3>
              <p>
                We retain your information for as long as necessary to provide our services and comply 
                with legal obligations. You can request deletion of your data at any time through your 
                account settings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">6. Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal information. You can also 
                opt out of certain communications and request data portability. Contact us to exercise these rights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">7. Third-Party Services</h3>
              <p>
                We may use third-party services for analytics, hosting, and AI processing. These services 
                are bound by confidentiality agreements and only process data as directed by us.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500">
                This privacy policy is effective as of the date listed above. We may update this policy 
                from time to time, and we will notify you of any material changes.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link href="/auth/sign-up">
            <Button variant="outline">Back to Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
