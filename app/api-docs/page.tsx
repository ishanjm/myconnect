"use client";

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="flex flex-col flex-1 p-8 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      <SwaggerUI url="/api/docs-spec" />
    </div>
  );
}
