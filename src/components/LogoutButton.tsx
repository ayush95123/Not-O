'use client'

import { logout } from '@/app/(auth)/actions'
// import { logout } from '@/app/actions/logout'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useTransition } from 'react'

export function LogoutButton() {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      variant="destructive"
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
    >
      <LogOut className="mr-1 h-4 w-4" />
      <span>Logout</span>
    </Button>
  )
}
