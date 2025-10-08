import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("james@fincompany.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    
    if (success) {
      // Route based on email
      if (email === 'james@fincompany.com') {
        navigate("/dashboard");
      } else if (email === 'martha@intelletica.com') {
        navigate("/support-dashboard");
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Use james@fincompany.com or martha@intelletica.com",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8 animate-fade-in">
          <div className="flex items-center justify-center mb-8">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mr-3">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">FinCompany</h1>
              <p className="text-sm text-muted-foreground">Enterprise Portal</p>
            </div>
          </div>

          {/* <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Secure SSO Access</p>
              <p className="text-xs text-muted-foreground mt-1">
                Single Sign-On authentication powered by enterprise security
              </p>
            </div>
          </div> */}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fincompany.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>Business User: james@fincompany.com</p>
              <p>Support Engineer: martha@intelletica.com</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Single Sign-On authentication powered by enterprise security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
