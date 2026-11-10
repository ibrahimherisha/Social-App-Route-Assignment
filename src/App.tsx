import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { ActionIcon, AppShell, Button, Group, Text, Title, useMantineColorScheme } from "@mantine/core";
import { Bookmark, Home, MessageCircle, Moon, Sun, User } from "lucide-react";
import AppRoutes from "./Routes.tsx";
import Backdrop from "./components/Backdrop.tsx";

const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/bookmarks", label: "Bookmarks", Icon: Bookmark },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

const BAR_SHADOW = "inset 0 1px 0 var(--glass-edge), 0 12px 32px -18px rgba(0, 0, 10, 0.5)";

export default function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Backdrop />
      <AppShell header={{ height: 60 }} footer={{ height: 60 }} padding="md">
        <AppShell.Header
          style={{
            background: "var(--glass-bar)",
            borderBottom: "1px solid var(--glass-border)",
            backdropFilter: "blur(22px) saturate(170%)",
            WebkitBackdropFilter: "blur(22px) saturate(170%)",
            boxShadow: BAR_SHADOW,
          }}>
          <Group h="100%" px="md" justify="space-between">
            <Group gap="sm" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
              <div className="brand-mark">
                <MessageCircle size={21} color="#fff" />
              </div>
              <div>
                <Title order={3} className="brand-name">
                  Magic Social
                </Title>
                <Text className="brand-sub">Connect · Share</Text>
              </div>
            </Group>
            {user && (
              <Group gap="xs" visibleFrom="sm">
                {NAV_ITEMS.map(({ to, label }) => (
                  <Button
                    key={to}
                    variant="subtle"
                    size="sm"
                    className={location.pathname === to ? "nav-pill active" : "nav-pill"}
                    onClick={() => navigate(to)}>
                    {label}
                  </Button>
                ))}
              </Group>
            )}
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                className="icon-btn"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleColorScheme}>
                {dark ? <Sun size={20} /> : <Moon size={20} />}
              </ActionIcon>
              {user && (
                <Button variant="light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <AppRoutes />
        </AppShell.Main>

        {user && (
          <AppShell.Footer
            hiddenFrom="sm"
            style={{
              background: "var(--glass-bar)",
              borderTop: "1px solid var(--glass-border)",
              backdropFilter: "blur(22px) saturate(170%)",
              WebkitBackdropFilter: "blur(22px) saturate(170%)",
              boxShadow:
                "inset 0 1px 0 var(--glass-edge), 0 20px 40px -14px rgba(0, 0, 20, 0.6)",
            }}>
            <Group h="100%" px="md" justify="space-around">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <ActionIcon
                  key={to}
                  variant="subtle"
                  size="lg"
                  aria-label={label}
                  className={location.pathname === to ? "nav-icon active" : "nav-icon"}
                  onClick={() => navigate(to)}>
                  <Icon size={22} />
                </ActionIcon>
              ))}
            </Group>
          </AppShell.Footer>
        )}
      </AppShell>
    </>
  );
}
