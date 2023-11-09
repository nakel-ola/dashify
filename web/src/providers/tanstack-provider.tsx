"use client";

import { queryClient } from "@/lib/tanstack-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type PropsWithChildren } from "react";

export default function TanstackProvider({ children }: PropsWithChildren) {
  const [client] = useState(() => queryClient);
  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
