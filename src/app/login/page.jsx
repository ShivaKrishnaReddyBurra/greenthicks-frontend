"use client";

import { Suspense } from "react";
import ClientLogin from "./ClientLogin";
import LeafLoader from "@/components/LeafLoader";

export default function LoginPage() {
  return (
    <Suspense fallback={<LeafLoader />}>
      <ClientLogin />
    </Suspense>
  );
}