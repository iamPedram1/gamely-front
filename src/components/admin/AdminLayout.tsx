import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Gamepad2, Tag, FolderOpen, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: "/dashboard/posts", icon: FileText, label: "Posts" },
    { path: "/dashboard/games", icon: Gamepad2, label: "Games" },
    { path: "/dashboard/categories", icon: FolderOpen, label: "Categories" },
    { path: "/dashboard/tags", icon: Tag, label: "Tags" },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} border-r border-primary/20 bg-accent/30 transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-primary/20">
          <Link to="/dashboard/posts" className="flex items-center gap-3 font-bold text-xl">
            <div className="p-2 rounded-xl bg-gradient-gaming glow-effect">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && <span className="gradient-gaming-text">ADMIN</span>}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive(item.path) 
                    ? "gradient-gaming glow-effect" 
                    : "hover:bg-primary/10"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span className="font-semibold">{item.label}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-primary/10">
              <LogOut className="h-5 w-5" />
              {sidebarOpen && <span>Back to Site</span>}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-primary/20 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Admin Dashboard</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
