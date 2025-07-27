import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: "dashboard", label: "홈" },
    { path: "/map", icon: "map", label: "지도" },
    { path: "/history", icon: "history", label: "기록" },
    { path: "/profile", icon: "person", label: "프로필" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center space-y-1 py-2 px-3 ${
                  isActive ? 'text-[hsl(207,81%,45%)]' : 'text-gray-400'
                }`}
              >
                <span className="material-icons">{item.icon}</span>
                <span className="text-xs">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
