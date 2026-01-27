import { StoreProvider } from "@/lib/store/provider";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      {children}
      <Toaster position="top-right" richColors />
    </StoreProvider>
  );
}
