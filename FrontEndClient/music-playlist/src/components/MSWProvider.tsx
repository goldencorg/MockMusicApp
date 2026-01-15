'use client'
import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    async function enableMocking() {
      console.log('Attempting to start MSW...');

      if (typeof window !== 'undefined') {
        try {
            const { worker } = await import('@/mocks/browser')
            
            // Start the worker
            await worker.start({
                onUnhandledRequest: 'bypass',
            })
            
            console.log('✅ MSW Started Successfully');
        } catch (error) {
            console.error('❌ MSW Failed to start:', error);
        }
      }
      setMswReady(true)
    }

    enableMocking()
  }, [])

  if (!mswReady) {
      return <div className="p-10 font-bold">Starting Mock Server...</div>
  }

  return <>{children}</>
}