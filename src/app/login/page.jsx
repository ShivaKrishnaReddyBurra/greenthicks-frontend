import { Suspense } from 'react';
import ClientLogin from './ClientLogin';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientLogin />
    </Suspense>
  );
}