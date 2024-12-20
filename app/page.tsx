import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component
const ClientCalculator = dynamic(() => import('@/components/ClientCalculator'), {
  loading: () => (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-lg text-gray-500">Loading calculator...</div>
    </div>
  ),
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-lg text-gray-500">Loading calculator...</div>
        </div>
      }>
        <div className="max-w-4xl mx-auto">
        <ClientCalculator />
        </div>
      </Suspense>

      <div className="text-sm text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg max-w-4xl mx-auto">
        <p className="mb-2">
          © {new Date().getFullYear()} Upfront Operations. This calculator is provided as-is without any warranties or guarantees. 
          While we strive for accuracy, results should be used as general guidance rather than definitive metrics.
        </p>
        <p className="mb-2">
          Want to use this calculator on your own site? We&apos;re happy to share! Just reach out and include a backlink to us. 
          We believe in helping the whole community grow. 🤝
          You can find the list of sources we used <a href="https://github.com/upfront-operations/pipeline-calc/" className="text-blue-500 hover:text-blue-600">here in our GitHub repo</a>. Feel free to explore the rest of the code as well.
        </p>
        <p>
          <span className="text-gray-400">Unauthorized use, reproduction, or distribution is prohibited. But seriously, just ask - we&apos;re friendly! Contact us at </span>
          <a href="mailto:support@upfrontoperations.com" className="text-blue-500 hover:text-blue-600">support@upfrontoperations.com</a>
        </p>
      </div>
    </main>
  );
}