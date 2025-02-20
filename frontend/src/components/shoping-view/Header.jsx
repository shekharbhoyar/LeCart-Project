import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import MenuMUI from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "../../config/index";
import { logoutUser } from "../../store/auth-slice/index";
import UserCartWrapper from "./Cartwrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "../../store/shop/cartSlice/index";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Typography
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Typography>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Button onClick={() => setOpenCartDrawer(true)}>
        <ShoppingCart className="w-6 h-6" />
        <span className="ml-2">{cartItems?.items?.length || 0}</span>
      </Button>
      <Drawer
        anchor="right"
        open={openCartDrawer}
        onClose={() => setOpenCartDrawer(false)}
      >
        <UserCartWrapper
          setOpenCartDrawer={setOpenCartDrawer}
          cartItems={cartItems?.items?.length ? cartItems.items : []}
        />
      </Drawer>
      <Avatar
        onClick={(e) => setAnchorEl(e.currentTarget)}
        className="cursor-pointer"
      >
        {user?.userName[0].toUpperCase()}
      </Avatar>
      <MenuMUI
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>Logged in as {user?.userName}</MenuItem>
        <Divider />
        <MenuItem onClick={() => navigate("/shop/account")}>
          <UserCog className="mr-2 h-4 w-4" /> Account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </MenuItem>
      </MenuMUI>
    </div>
  );
}

function ShoppingHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">LeCart</span>
        </Link>
        <Button className="lg:hidden ">
          <MenuIcon />
        </Button>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
