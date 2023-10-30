"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";

export default function Dashboard() {
  return (
    <div>
      <h1 className="">Dashboard</h1>

      <Button className="" onClick={() => signOut({})}>
        Sign Out
      </Button>
    </div>
  );
}
