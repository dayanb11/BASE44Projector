

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  BarChart3,
  Settings,
  Building2,
  Edit,
  Eye,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const baseNavigationItems = [
  {
    title: "לוח בקרה",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "שולחן עבודה",
    url: createPageUrl("Programs"),
    icon: ClipboardList,
  },
  {
    title: "פרטי משימה",
    url: createPageUrl("ProgramDetails"),
    icon: Eye,
  },
  {
    title: "עריכת משימה",
    url: createPageUrl("EditProgram"),
    icon: Edit,
  },
  {
    title: "דרישה חדשה",
    url: createPageUrl("NewRequirement"),
    icon: FileText,
  },
  {
    title: "דוחות",
    url: createPageUrl("Reports"),
    icon: BarChart3,
  },
  {
    title: "הגדרות מערכת",
    url: createPageUrl("Settings"),
    icon: Settings,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const checkAuth = () => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      try {
        setCurrentEmployee(JSON.parse(storedEmployee));
      } catch (error) {
        console.error("Failed to parse current employee from session storage:", error);
        setCurrentEmployee(null);
        sessionStorage.removeItem("currentEmployee"); // Clear malformed data
      }
    } else {
      setCurrentEmployee(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [location]);
  
  // This effect listens for a custom event that will be dispatched on login
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("currentEmployee");
    window.dispatchEvent(new Event('authChange')); // Dispatch event on logout
    window.location.reload(); // Reload the page to clear state and redirect to login
  };

  const navigationItems = [
    ...baseNavigationItems,
    {
      isAction: true,
      title: "יציאה",
      action: handleLogout,
      icon: LogOut,
    },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar side="right" className="border-l border-gray-200">
            <SidebarHeader className="border-b border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <h2 className="font-bold text-lg text-gray-900">פרוג'קטור</h2>
                  <p className="text-xs text-gray-500">מערכת ניהול משימות רכש</p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent className="p-2">
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium text-gray-500 text-right px-2 py-2">
                  תפריט ראשי
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild={!item.isAction}
                          onClick={item.isAction ? item.action : undefined}
                          className={`hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 rounded-lg mb-1 justify-start flex-row-reverse ${
                            !item.isAction && location.pathname === item.url
                              ? "bg-blue-50 text-blue-700"
                              : ""
                          } ${item.isAction ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''}`}
                        >
                          {item.isAction ? (
                            <div className="flex items-center gap-3 px-3 py-2 w-full cursor-pointer">
                              <span className="font-medium text-right flex-1">{item.title}</span>
                              <item.icon className="w-4 h-4" />
                            </div>
                          ) : (
                            <Link
                              to={item.url}
                              className="flex items-center gap-3 px-3 py-2 w-full"
                            >
                              <span className="font-medium text-right flex-1">{item.title}</span>
                              <item.icon className="w-4 h-4" />
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-200 p-4">
              {currentEmployee ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0 text-right">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {currentEmployee.full_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentEmployee.email || "אין דואר אלקטרוני"}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">
                      {currentEmployee.full_name?.charAt(0) || ''}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-right">לא מחובר</div>
              )}
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">פרוג'קטור</h1>
                <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

