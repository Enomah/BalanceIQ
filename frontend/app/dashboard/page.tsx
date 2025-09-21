"use client"

import Dashboard from "@/components/dashboard/Dashboard"
import { requireAuth } from "@/lib/requireAuth"

export default function page() {
    requireAuth()
  return (
    <Dashboard/>
  )
}
