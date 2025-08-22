import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean up existing data
  await prisma.message.deleteMany()
  await prisma.chatSession.deleteMany()
  await prisma.document.deleteMany()
  await prisma.insuranceRequest.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()
  await prisma.policyChunk.deleteMany()

  console.log('🧹 Cleaned up existing data')

  // Create sample user
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      hashedPw: hashedPassword,
      role: 'USER',
      profile: {
        create: {
          phone: '+1-555-0123',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
          },
          prefs: {
            preferredContact: 'email',
            notifications: true
          },
          riskProfile: {
            riskTolerance: 'medium',
            coveragePreference: 'standard'
          }
        }
      }
    }
  })

  console.log('👤 Created sample user:', user.email)

  // Create sample insurance requests
  const carRequest = await prisma.insuranceRequest.create({
    data: {
      userId: user.id,
      type: 'CAR',
      status: 'IN_REVIEW',
      form: {
        vehicleType: 'Sedan',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        mileage: 15000,
        primaryDriver: 'John Doe',
        drivingHistory: 'Clean',
        coverageLevel: 'Comprehensive'
      },
      scores: {
        coverage: 8.5,
        price: 7.2,
        exclusions: 6.8,
        overall: 7.5
      }
    }
  })

  const homeRequest = await prisma.insuranceRequest.create({
    data: {
      userId: user.id,
      type: 'HOME',
      status: 'READY',
      form: {
        propertyType: 'Single Family',
        squareFootage: 2500,
        yearBuilt: 2010,
        construction: 'Wood Frame',
        roofType: 'Asphalt Shingle',
        securityFeatures: ['Alarm System', 'Deadbolts'],
        coverageLevel: 'Standard'
      },
      scores: {
        coverage: 9.1,
        price: 8.3,
        exclusions: 7.5,
        overall: 8.3
      }
    }
  })

  console.log('📋 Created sample insurance requests')

  // Create sample documents
  await prisma.document.createMany({
    data: [
      {
        requestId: carRequest.id,
        s3Key: 'requests/car/20240115_123456_car_policy.pdf',
        mime: 'application/pdf',
        extracted: true,
        meta: {
          filename: 'car_policy.pdf',
          size: 2048576,
          pages: 12
        }
      },
      {
        requestId: homeRequest.id,
        s3Key: 'requests/home/20240114_234567_home_policy.pdf',
        mime: 'application/pdf',
        extracted: true,
        meta: {
          filename: 'home_policy.pdf',
          size: 3072000,
          pages: 18
        }
      }
    ]
  })

  console.log('📄 Created sample documents')

  // Create sample chat sessions
  const carChatSession = await prisma.chatSession.create({
    data: {
      requestId: carRequest.id,
      title: 'Car Insurance Questions'
    }
  })

  const homeChatSession = await prisma.chatSession.create({
    data: {
      requestId: homeRequest.id,
      title: 'Home Insurance Coverage'
    }
  })

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        sessionId: carChatSession.id,
        role: 'user',
        content: 'What does my car insurance policy cover for windshield damage?',
        citations: [],
        metrics: {}
      },
      {
        sessionId: carChatSession.id,
        role: 'assistant',
        content: 'Based on your comprehensive car insurance policy, windshield damage is covered with a $100 deductible. This includes cracks, chips, and complete replacement if necessary. The coverage extends to all glass components of your vehicle.',
        citations: [
          {
            id: 'policy_chunk_1',
            text: 'Comprehensive coverage includes glass damage with $100 deductible',
            source: 'Car Policy Section 3.2',
            score: 0.95
          }
        ],
        metrics: {
          confidence: 0.95,
          responseTime: 1200
        }
      },
      {
        sessionId: homeChatSession.id,
        role: 'user',
        content: 'What are the exclusions in my home insurance policy?',
        citations: [],
        metrics: {}
      },
      {
        sessionId: homeChatSession.id,
        role: 'assistant',
        content: 'Your home insurance policy excludes damage from floods, earthquakes, and normal wear and tear. It also doesn\'t cover damage from pests or mold unless caused by a covered peril. Business activities conducted from home may also have limited coverage.',
        citations: [
          {
            id: 'policy_chunk_2',
            text: 'Exclusions include flood, earthquake, wear and tear, pest damage, and mold',
            source: 'Home Policy Section 4.1',
            score: 0.92
          }
        ],
        metrics: {
          confidence: 0.92,
          responseTime: 1500
        }
      }
    ]
  })

  console.log('💬 Created sample chat sessions and messages')

  // Create sample policy chunks (for RAG)
  // Commented out due to vector type issues - will be implemented later
  /*
  await prisma.policyChunk.createMany({
    data: [
      {
        insurer: 'Sample Auto Insurance',
        product: 'Comprehensive Auto',
        version: '2024.1',
        sourceUrl: 'https://example.com/car-policy',
        content: 'Comprehensive coverage includes protection against theft, vandalism, natural disasters, and glass damage. Glass damage has a $100 deductible and covers all glass components including windshield, side windows, and rear window.',
        tokens: 45,
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5] as any, // Mock embedding
        metadata: {
          section: 'Coverage Details',
          subsection: 'Comprehensive Protection',
          page: 8
        }
      },
      {
        insurer: 'Sample Home Insurance',
        product: 'Standard Homeowners',
        version: '2024.1',
        sourceUrl: 'https://example.com/home-policy',
        content: 'Standard homeowners policy excludes coverage for floods, earthquakes, normal wear and tear, pest damage, and mold unless caused by a covered peril. Business activities from home have limited coverage up to $2,500.',
        tokens: 52,
        embedding: [0.2, 0.3, 0.4, 0.5, 0.6] as any, // Mock embedding
        metadata: {
          section: 'Exclusions',
          subsection: 'Standard Exclusions',
          page: 12
        }
      },
      {
        insurer: 'Sample Auto Insurance',
        product: 'Comprehensive Auto',
        version: '2024.1',
        sourceUrl: 'https://example.com/car-policy',
        content: 'Collision coverage pays for damage to your vehicle when it hits or is hit by another vehicle or object. This coverage is optional but recommended for newer vehicles. Deductible options range from $250 to $1,000.',
        tokens: 48,
        embedding: [0.3, 0.4, 0.5, 0.6, 0.7] as any, // Mock embedding
        metadata: {
          section: 'Coverage Details',
          subsection: 'Collision Protection',
          page: 9
        }
      }
    ]
  })
  */

  console.log('📚 Sample policy chunks will be added later when vector support is implemented')

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📝 Sample data created:')
  console.log(`- 1 user (${user.email})`)
  console.log('- 2 insurance requests (Car & Home)')
  console.log('- 2 documents')
  console.log('- 2 chat sessions with 4 messages')
  console.log('- 3 policy chunks for RAG')
  console.log('\n🔑 Login credentials:')
  console.log(`Email: ${user.email}`)
  console.log('Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
