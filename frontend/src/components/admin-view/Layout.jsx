// import React from "react";
// import { Outlet } from "react-router-dom";
// import AdminSidebar from "./Sidebar";
// import AdminHeader from "./Header";

// function AdminLayout() {
//   return (
//     <div className="flex min-h-screen w-full">
//       <AdminSidebar />
//       <div className="flex flex-1 flex-col">
//         <AdminHeader />
//         <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./Sidebar";
import AdminHeader from "./Header";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";

function AdminLayout() {
  const [open, setOpen] = useState(false); // State to toggle sidebar

  return (
    <div className="flex min-h-screen w-full">
      {/* Hamburger Button for Small Screens */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          display: { xs: "block", lg: "none" },
          position: "absolute",
          top: 10,
          left: 10,
          boxShadow: "none", // Removes shadow
          background: "transparent", // Ensures no background styling
          "&:hover": {
            background: "transparent", // Prevents hover shadow or background
          },
        }}
      >
        <Menu />
      </IconButton>

      {/* Sidebar with open state */}
      <AdminSidebar open={open} setOpen={setOpen} />

      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
