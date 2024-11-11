import PipelineCalculator from './components/PipelineCalculator';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="w-full max-w-4xl mx-auto">
        <PipelineCalculator />
      </div>

      <div className="text-sm text-gray-500 mt-8 p-4 bg-gray-50 rounded-lg max-w-4xl mx-auto">
        <p className="mb-2">
          © {new Date().getFullYear()} Upfront Operations. This calculator is provided as-is without any warranties or guarantees. 
          While we strive for accuracy, results should be used as general guidance rather than definitive metrics.
        </p>
        <p className="mb-2">
          Want to use this calculator on your own site? We&apos;re happy to share! Just reach out and include a backlink to us. 
          We believe in helping the whole community grow. 🤝
        </p>
        <p>
          <span className="text-gray-400">Unauthorized use, reproduction, or distribution is prohibited. But seriously, just ask - we&apos;re friendly! Contact us at </span>
          <a href="mailto:hello@upfrontoperations.com" className="text-blue-500 hover:text-blue-600">hello@upfrontoperations.com</a>
        </p>
      </div>
    </main>
  );
}