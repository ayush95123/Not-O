'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function LoginSignupToggle() {
  const pathname = usePathname()
  const isLogin = pathname === '/login'

  return (
    <div className="mt-4 text-center text-sm">
      {isLogin ? (
        <p>
          Not registered?
          <Link href="/signup" className="text-blue-600 underline ml-1">
            Sign up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?
          <Link href="/login" className="text-blue-600 underline ml-1">
            Log in
          </Link>
        </p>
      )}
    </div>
  )
}
