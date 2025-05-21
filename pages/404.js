import React from 'react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Seite nicht gefunden</h1>
      <p className="mb-6">Die gesuchte Seite konnte nicht gefunden werden.</p>
      <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Zurück zur Startseite
      </Link>
    </div>
  );
} 