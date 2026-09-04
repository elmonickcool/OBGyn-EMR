import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useCallback, useState } from "react";
import logoSrc from "../assets/Doc_Rikka_Logo.png";

// ─── Vibrant OB-Gyne Tokens ────────────────────────────────────────────────
const t = {
  fuchsia: "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  violet: "#7C4DFF",
  violetLt: "#EDE7F6",
  teal: "#00BFA5",
  online: "#4ADE80",
  ink: "#1A0533",
  midgray: "#7B6F84",
  hairline: "#EDE0F2",
  offwhite: "#FDFAFF",
  white: "#FFFFFF",
};

const SIDEBAR_WIDTH = 240;
const TOPBAR_HEIGHT = 60;

const navLinks = [
  { to: "/", label: "Patients", icon: PeopleIcon },
  { to: "/add-patient", label: "Add Patient", icon: PersonAddIcon },
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
];

// ─── Sidebar header: logo + clinic identity ────────────────────────────────
function ClinicHeader({ isMobile, onClose }) {
  return (
    <Box sx={{ px: 2.5, pt: 3, pb: 2.5, position: "relative" }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {isMobile && (
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close navigation menu"
            sx={{
              color: "rgba(255,255,255,0.55)",
              mr: 0.25,
              "&:hover": { color: "#fff", background: "rgba(255,255,255,0.08)" },
              "&:focus-visible": {
                outline: `2px solid ${t.fuchsia}`,
                outlineOffset: 2,
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}

        <Box
          component={Link}
          to="/"
          aria-label="Doc Rikka home"
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            p: 0.75,
            background: `linear-gradient(135deg, ${t.fuchsia} 0%, ${t.violet} 100%)`,
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: `0 6px 20px ${t.fuchsia}45, inset 0 1px 0 rgba(255,255,255,0.18)`,
            transition: "transform 0.18s ease, box-shadow 0.18s ease",
            "&:hover": {
              transform: "scale(1.04)",
              boxShadow: `0 8px 24px ${t.fuchsia}5C, inset 0 1px 0 rgba(255,255,255,0.18)`,
            },
            "&:focus-visible": {
              outline: `2px solid #fff`,
              outlineOffset: 2,
            },
          }}
        >
          <Box
            component="img"
            src={logoSrc}
            alt="Doc Rikka clinic logo"
            sx={{
              width: "150%",
              height: "150%",
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.25))",
            }}
          />
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Doc Rikka
          </Typography>

          <Typography
            sx={{
              mt: 0.35,
              fontSize: 9.5,
              fontWeight: 600,
              color: "rgba(255,255,255,0.48)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Women's Medical Clinic
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mt: 0.8 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: t.online,
                boxShadow: `0 0 8px ${t.online}B3`,
              }}
              aria-hidden="true"
            />
            <Typography
              sx={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}
            >
              EMR SYSTEM ONLINE
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 2.5,
          height: "1px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 55%, transparent 100%)",
        }}
      />
    </Box>
  );
}

// ─── Sidebar nav links ──────────────────────────────────────────────────────
function SidebarNav({ isActive, isMobile, onNavigate }) {
  return (
    <Box component="nav" aria-label="Main" sx={{ px: 2, flex: 1, position: "relative" }}>
      {navLinks.map(({ to, label, icon: Icon }) => {
        const active = isActive(to);
        return (
          <Link
            key={to}
            to={to}
            style={{ textDecoration: "none" }}
            aria-current={active ? "page" : undefined}
            onClick={() => isMobile && onNavigate()}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.3,
                mb: 0.5,
                borderRadius: 2.5,
                background: active
                  ? `#ff2ba6`
                  : "transparent",
                border: active ? `1px solid ${t.fuchsia}55` : "1px solid transparent",
                boxShadow: active ? `0 4px 16px ${t.fuchsia}44` : "none",
                transition: "all 0.18s ease",
                "&:hover": !active && {
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                },
                "&:focus-visible": {
                  outline: `2px solid ${t.fuchsia}`,
                  outlineOffset: 2,
                },
              }}
            >
              <Icon
                sx={{
                  fontSize: 18,
                  lineHeight: 1,
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                }} aria-hidden="true" />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  letterSpacing: active ? "0" : "0.01em",
                }}
              >
                {label}
              </Typography>
              {active && (
                <Box
                  sx={{
                    ml: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0.9,
                  }}
                  aria-hidden="true"
                />
              )}
            </Box>
          </Link>
        );
      })}
    </Box>
  );
}

// ─── Sidebar (shared between permanent desktop rail + mobile drawer) ──────
function Sidebar({ isActive, isMobile, onClose }) {
  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        background: "linear-gradient(175deg, #6b155d 0%, #ac1818 60%, #c2005a 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: `radial-gradient(circle, #c2005a 25%, transparent 70%)`,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 40,
          right: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${t.violet}22 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <ClinicHeader isMobile={isMobile} onClose={onClose} />

      <Typography
        sx={{
          px: 3,
          mb: 1,
          fontSize: 10,
          fontWeight: 700,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Navigation
      </Typography>

      <SidebarNav isActive={isActive} isMobile={isMobile} onNavigate={onClose} />

      <Box sx={{ px: 3, py: 2.5, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
          EMR System v1.0
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Topbar ─────────────────────────────────────────────────────────────────
function Topbar({ isMobile, onMenuClick, currentLabel }) {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        height: TOPBAR_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(12px)",
        borderBottom: `1.5px solid ${t.hairline}`,
        boxShadow: "0 1px 12px rgba(233,30,140,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        {isMobile && (
          <IconButton
            onClick={onMenuClick}
            size="small"
            aria-label="Open navigation menu"
            sx={{
              color: t.ink,
              mr: 0.5,
              "&:hover": { background: t.fuchsiaLt },
              "&:focus-visible": {
                outline: `2px solid ${t.fuchsia}`,
                outlineOffset: 2,
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          sx={{
            width: 3,
            height: 22,
            borderRadius: 2,
            background: `linear-gradient(180deg, ${t.fuchsia}, ${t.violet})`,
          }}
          aria-hidden="true"
        />
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: 13, sm: 15 },
            color: t.ink,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          Electronic Medical Records
        </Typography>
      </Stack>

      <Box
        sx={{
          px: 2,
          py: 0.6,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${t.fuchsiaLt}, ${t.violetLt})`,
          border: `1.5px solid ${t.fuchsia}22`,
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: t.fuchsiaDk }}>
          {currentLabel}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Layout ─────────────────────────────────────────────────────────────────
function MainLayout() {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = useCallback(
    (to) => (to === "/" ? pathname === "/" : pathname.startsWith(to)),
    [pathname]
  );

  const closeDrawer = useCallback(() => setMobileOpen(false), []);
  const openDrawer = useCallback(() => setMobileOpen(true), []);

  const currentLabel = navLinks.find((l) => isActive(l.to))?.label ?? "EMR";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FDF0F8 0%, #F3EEFF 50%, #E8F8FF 100%)",
      }}
    >
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            boxShadow: "4px 0 32px rgba(233,30,140,0.18)",
          }}
        >
          <Sidebar isActive={isActive} isMobile={false} onClose={closeDrawer} />
        </Box>
      )}

      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={closeDrawer}
          PaperProps={{
            sx: { width: SIDEBAR_WIDTH, border: "none", boxShadow: "4px 0 32px rgba(233,30,140,0.25)" },
          }}
        >
          <Sidebar isActive={isActive} isMobile onClose={closeDrawer} />
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar isMobile={isMobile} onMenuClick={openDrawer} currentLabel={currentLabel} />
        <Box component="main" sx={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
