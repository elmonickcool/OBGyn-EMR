import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Drawer,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material";
import { useState } from "react";

// ─── Vibrant OB-Gyne Tokens ────────────────────────────────────────────────
const t = {
  fuchsia:   "#E91E8C",
  fuchsiaDk: "#AD1457",
  fuchsiaLt: "#FCE4EC",
  violet:    "#7C4DFF",
  violetLt:  "#EDE7F6",
  teal:      "#00BFA5",
  ink:       "#1A0533",
  midgray:   "#7B6F84",
  hairline:  "#EDE0F2",
  offwhite:  "#FDFAFF",
  white:     "#FFFFFF",
};

const navLinks = [
  { to: "/",            label: "Patients",    emoji: "👩" },
  { to: "/add-patient", label: "Add Patient", emoji: "➕" },
  { to: "/dashboard",   label: "Dashboard",   emoji: "📊" },
];

function MainLayout() {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  // ── Sidebar content (shared between permanent + drawer) ─────────────────
  const SidebarContent = (
    <Box
      sx={{
        width: 240,
        height: "100%",
        background:
          "linear-gradient(175deg, #1A0533 0%, #2D0A5A 60%, #1A1040 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative glow orbs */}
      <Box sx={{
        position: "absolute", top: -60, left: -60,
        width: 200, height: 200, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.fuchsia}33 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: 40, right: -40,
        width: 150, height: 150, borderRadius: "50%",
        background: `radial-gradient(circle, ${t.violet}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Logo area */}
      <Box sx={{ px: 3, pt: 4, pb: 3, position: "relative" }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          {/* Close button on mobile (inside drawer) */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(false)}
              size="small"
              sx={{
                color: "rgba(255,255,255,0.6)",
                mr: 0.5,
                "&:hover": { color: "#fff", background: "rgba(255,255,255,0.08)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
          <Box sx={{
            width: 40, height: 40, borderRadius: 2.5,
            background: `linear-gradient(135deg, ${t.fuchsia}, ${t.violet})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
            boxShadow: `0 4px 14px ${t.fuchsia}55`,
          }}>
            🌸
          </Box>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 900, color: t.white, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
              Doc Rikka
            </Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Women's Clinic
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ mt: 2.5, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }} />
      </Box>

      {/* Nav section label */}
      <Typography sx={{ px: 3, mb: 1, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Navigation
      </Typography>

      {/* Nav links */}
      <Box sx={{ px: 2, flex: 1, position: "relative" }}>
        {navLinks.map(({ to, label, emoji }) => {
          const active = isActive(to);
          return (
            <Link
              key={to}
              to={to}
              style={{ textDecoration: "none" }}
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 2,
                py: 1.3,
                mb: 0.5,
                borderRadius: 2.5,
                background: active
                  ? `linear-gradient(90deg, ${t.fuchsia}CC, ${t.violet}AA)`
                  : "transparent",
                border: active
                  ? `1px solid ${t.fuchsia}55`
                  : "1px solid transparent",
                boxShadow: active ? `0 4px 16px ${t.fuchsia}44` : "none",
                transition: "all 0.18s ease",
                "&:hover": !active && {
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                },
              }}>
                <Typography sx={{ fontSize: 16, lineHeight: 1 }}>{emoji}</Typography>
                <Typography sx={{
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  letterSpacing: active ? "0" : "0.01em",
                }}>
                  {label}
                </Typography>
                {active && (
                  <Box sx={{ ml: "auto", width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.9 }} />
                )}
              </Box>
            </Link>
          );
        })}
      </Box>

      {/* Footer tag */}
      <Box sx={{ px: 3, py: 2.5, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
          EMR System v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: `linear-gradient(160deg, #FDF0F8 0%, #F3EEFF 50%, #E8F8FF 100%)` }}>

      {/* ── Desktop Sidebar (permanent) ──────────────────────────────────── */}
      {!isMobile && (
        <Box sx={{
          width: 240,
          flexShrink: 0,
          boxShadow: `4px 0 32px rgba(233,30,140,0.18)`,
        }}>
          {SidebarContent}
        </Box>
      )}

      {/* ── Mobile Drawer ────────────────────────────────────────────────── */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{
            sx: {
              width: 240,
              border: "none",
              boxShadow: `4px 0 32px rgba(233,30,140,0.25)`,
            },
          }}
        >
          {SidebarContent}
        </Drawer>
      )}

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Topbar */}
        <Box sx={{
          px: { xs: 2, sm: 4 },
          py: 0,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          borderBottom: `1.5px solid ${t.hairline}`,
          boxShadow: `0 1px 12px rgba(233,30,140,0.06)`,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            {/* Hamburger — mobile only */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                size="small"
                sx={{
                  color: t.ink,
                  mr: 0.5,
                  "&:hover": { background: t.fuchsiaLt },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ width: 3, height: 22, borderRadius: 2, background: `linear-gradient(180deg, ${t.fuchsia}, ${t.violet})` }} />
            <Typography sx={{
              fontWeight: 800,
              fontSize: { xs: 13, sm: 15 },
              color: t.ink,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}>
              Electronic Medical Records
            </Typography>
          </Stack>

          {/* Current page badge */}
          <Box sx={{
            px: 2, py: 0.6,
            borderRadius: 2,
            background: `linear-gradient(90deg, ${t.fuchsiaLt}, ${t.violetLt})`,
            border: `1.5px solid ${t.fuchsia}22`,
            flexShrink: 0,
          }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: t.fuchsiaDk }}>
              {navLinks.find((l) => isActive(l.to))?.label ?? "EMR"}
            </Typography>
          </Box>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
}

export default MainLayout;