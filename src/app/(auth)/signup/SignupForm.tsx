'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { signup } from '../actions'

const initialState = {
  error: null as string | null,
};

export default function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className={cn({ 'border-red-500': state?.error?.includes('email') })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className={cn({ 'border-red-500': state?.error?.includes('password') })}
        />
      </div>

      <Button className="w-full" type="submit">
        Sign Up
      </Button>

      {state?.error && (
        <p className="text-sm text-red-500 text-center">{state.error}</p>
      )}
    </form>
  )
}
