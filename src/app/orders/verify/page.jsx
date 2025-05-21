import { Suspense } from 'react';
import ClientLogin from './OrderVerifyPage';
import OrderVerifyPage from './OrderVerifyPage';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderVerifyPage />
    </Suspense>
  );
}