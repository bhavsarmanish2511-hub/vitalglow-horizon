import { User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationPanel } from "@/components/support/NotificationPanel";

interface DashboardHeaderProps {
  onNotificationClick?: (ticketId: string) => void;
}

export function DashboardHeader({ onNotificationClick }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Show initials for avatar fallback
  const avatarInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  const roleLabels = {
    business: "Business User",
    support: "Support Engineer",
    admin: "Administrator",
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6" aria-label="Dashboard Header">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary">FinCompany Portal</h1>
      </div>

      <div className="flex items-center gap-4">
        {onNotificationClick && (
          <NotificationPanel onNotificationClick={onNotificationClick} />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Light blue hover effect */}
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-blue-50 transition-colors"
            >
              <Avatar className="h-8 w-8" aria-label="User Avatar">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="flex items-center gap-2">
                  {/* Explicitly set text color to black */}
                  <p className="text-sm font-medium text-black">{user?.name || 'User'}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {roleLabels[user?.role] || "User"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              logout();
              navigate("/login");
            }}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}