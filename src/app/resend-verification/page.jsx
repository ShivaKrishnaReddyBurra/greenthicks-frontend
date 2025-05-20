import { Suspense } from "react";
import ResendVerificationClient from "./ResendVerificationClient"; // Adjust the path as needed

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResendVerificationClient />
    </Suspense>
  );
}