"use client";

import { useActionState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoginSignupToggle from "../LoginSignupToggle";
import { login } from "../actions";

const initialState = {
  error: null as string | null,
};

export default function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <Button className="w-full" type="submit">
        Log In
      </Button>

      <LoginSignupToggle />
    </form>
  );
}
