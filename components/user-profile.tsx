import { useAuth } from "@/components/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function UserProfile() {
  const { user, backendData, loading, syncingBackend } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Avatar>
            <AvatarFallback>
              {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Frontend Data (from Supabase) */}
        <div>
          <h4 className="font-medium mb-2">Account Info</h4>
          <div className="space-y-1 text-sm">
            <p><strong>Provider:</strong> 
              <Badge variant="outline" className="ml-2">
                {user.app_metadata?.provider || 'email'}
              </Badge>
            </p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        </div>

        {/* Backend Data (from MySQL) */}
        <div>
          <h4 className="font-medium mb-2 flex items-center">
            App Data 
            {syncingBackend && (
              <Loader2 className="h-3 w-3 animate-spin ml-2" />
            )}
          </h4>
          {backendData ? (
            <div className="space-y-1 text-sm">
              <p><strong>Chat Messages:</strong> {backendData.chatHistory?.length || 0}</p>
              <p><strong>Last Seen:</strong> {backendData.lastSeen || 'Never'}</p>
              <p><strong>Preferences:</strong> {Object.keys(backendData.preferences || {}).length} settings</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No app data yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
