import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <List>
      {adminSidebarMenuItems.map((menuItem) => (
        <ListItemButton
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen && setOpen(false);
          }}
        >
          <ListItemIcon>{menuItem.icon}</ListItemIcon>
          <ListItemText primary={menuItem.label} />
        </ListItemButton>
      ))}
    </List>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* MUI Drawer for sidebar */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <ChartNoAxesCombined size={30} />
              <Typography variant="h6" fontWeight="bold">
                Admin Panel
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <MenuItems setOpen={setOpen} />
        </Box>
      </Drawer>

      {/* Static Sidebar for larger screens */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: 250,
          flexDirection: "column",
          p: 2,
          borderRight: "1px solid #ddd",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/admin/dashboard")}
        >
          <ChartNoAxesCombined size={30} />
          <Typography variant="h6" fontWeight="bold">
            Admin Panel
          </Typography>
        </Box>
        <MenuItems />
      </Box>
    </Fragment>
  );
}

export default AdminSideBar;
