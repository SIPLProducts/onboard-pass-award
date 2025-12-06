import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useAuthContext } from '@/contexts/AuthContext';
import { useColorTheme, colorThemes } from '@/contexts/ColorThemeContext';
import { NavLink } from '@/components/NavLink';
import logo from '@/assets/logo.png';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  GraduationCap,
  Award,
  Settings,
  Users,
  BarChart3,
  LogOut,
  ChevronUp,
  Shield,
  BookOpen,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { toast } from 'sonner';

const AppSidebar = () => {
  const { profile, isAdmin, signOut } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme } = useColorTheme();
  const collapsed = state === 'collapsed';

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const cycleColorTheme = () => {
    const currentIndex = colorThemes.findIndex(t => t.id === colorTheme);
    const nextIndex = (currentIndex + 1) % colorThemes.length;
    setColorTheme(colorThemes[nextIndex].id);
    toast.success(`Theme: ${colorThemes[nextIndex].name}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const mainNavItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'My Courses', url: '/courses', icon: GraduationCap },
    { title: 'Certificates', url: '/certificates', icon: Award },
  ];

  const adminNavItems = [
    { title: 'Admin Dashboard', url: '/admin', icon: Settings },
    { title: 'Manage Courses', url: '/admin/courses', icon: BookOpen },
    { title: 'Employees', url: '/admin/employees', icon: Users },
    { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div
          className="flex cursor-pointer items-center justify-center px-2 py-3"
          onClick={() => navigate('/dashboard')}
        >
          <img src={logo} alt="KPC" className={collapsed ? "h-8 w-auto" : "h-10 w-auto"} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url || location.pathname.startsWith(item.url + '/')}
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                <span>Administration</span>
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Theme Toggle & User Footer */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={cycleColorTheme}
              tooltip="Change color theme"
              className="flex items-center gap-3"
            >
              <Palette className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{colorThemes.find(t => t.id === colorTheme)?.name || 'Theme'}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleTheme}
              tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              className="flex items-center gap-3"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 shrink-0" />
              ) : (
                <Moon className="h-4 w-4 shrink-0" />
              )}
              {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                      {profile ? getInitials(profile.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex flex-1 flex-col text-left text-sm leading-tight">
                      <span className="truncate font-medium">{profile?.full_name}</span>
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {profile?.employee_id}
                      </span>
                    </div>
                  )}
                  {!collapsed && <ChevronUp className="ml-auto h-4 w-4" />}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{profile?.full_name}</span>
                    <span className="text-xs text-muted-foreground">{profile?.department || 'No department'}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <div className="px-2 py-1.5">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      Admin
                    </Badge>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
