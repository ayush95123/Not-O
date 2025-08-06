import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
