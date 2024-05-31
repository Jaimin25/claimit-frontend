import React, { Suspense } from 'react';

import PaymentStatus from '@/components/Payment/payment-status';

export default function PaymentStatusPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Suspense>
        <PaymentStatus />
      </Suspense>
    </div>
  );
}
