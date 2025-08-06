
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import LoginSignupToggle from '../LoginSignupToggle'
import { signup } from '../actions'
import SignupForm from './SignupForm'

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center h-full px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupForm/>
          <LoginSignupToggle />
        </CardContent>
      </Card>
    </div>
  )
}
