import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export const Profile = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-gradient">Profile</span>
        </h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Profile settings will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
