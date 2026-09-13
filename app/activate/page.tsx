import type { Metadata } from "next";
import { ActivationForm } from "@/components/ActivationForm";

export const metadata: Metadata = {
  title: "Activar cuenta · OpenDayCare",
};

export default function ActivatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-login-bg p-10">
      <ActivationForm />
    </div>
  );
}
