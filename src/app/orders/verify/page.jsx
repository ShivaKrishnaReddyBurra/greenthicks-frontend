
"use client";

import { Suspense } from "react";
import OrderVerifyPage from "./OrderVerifyPage";
import LeafLoader from "@/components/LeafLoader";

export default function OrderVerifyWrapper() {
  return (
    <Suspense fallback={<LeafLoader />}>
      <OrderVerifyPage />
    </Suspense>
  );
}
