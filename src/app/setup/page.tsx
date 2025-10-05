"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface SetupResult {
  success: boolean;
  message: string;
  users: User[];
}

export default function SetupPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SetupResult | null>(null);

  const setupUsers = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/setup-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data: SetupResult = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        setResult(data);
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error setting up users:", error);
      toast({
        title: "Error",
        description: "Failed to set up users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Setup Users
          </h1>
          <p className="text-muted-foreground mt-2">
            Create initial user accounts for Super Admin, Admin, and Manager roles
          </p>
        </div>

        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>User Setup</CardTitle>
            <CardDescription>
              This will create the following users with their respective roles:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-indigo-500/30">
                <CardContent className="p-4">
                  <h3 className="font-bold text-indigo-600">Super Admin</h3>
                  <p className="text-sm text-muted-foreground mt-1">superadmin@smartadx.com</p>
                  <p className="text-xs mt-2">Full system access with all permissions</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-500/30">
                <CardContent className="p-4">
                  <h3 className="font-bold text-blue-600">Admin</h3>
                  <p className="text-sm text-muted-foreground mt-1">admin@smartadx.com</p>
                  <p className="text-xs mt-2">Administrative access with most permissions</p>
                </CardContent>
              </Card>
              
              <Card className="border-green-500/30">
                <CardContent className="p-4">
                  <h3 className="font-bold text-green-600">Manager</h3>
                  <p className="text-sm text-muted-foreground mt-1">manager@smartadx.com</p>
                  <p className="text-xs mt-2">Business management access</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={setupUsers} 
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isLoading ? "Setting up users..." : "Setup Users"}
              </Button>
            </div>

            {result && (
              <Card className="border-green-500/30 bg-green-500/10">
                <CardContent className="p-4">
                  <h3 className="font-bold text-green-600">Setup Complete!</h3>
                  <p className="text-sm mt-2">Users created successfully:</p>
                  <ul className="mt-2 space-y-1">
                    {result.users.map((user: User) => (
                      <li key={user.id} className="text-sm">
                        <span className="font-medium">{user.name}</span> - {user.email} ({user.role})
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card className="glass-morphism border-white/20">
          <CardHeader>
            <CardTitle>Login Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              For demonstration purposes, all users will use the same password: <span className="font-mono bg-muted px-2 py-1 rounded">password123</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              In a production environment, you would implement proper password hashing and secure authentication.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}