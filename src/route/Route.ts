import { Route, Routes } from "../lib/types/index";
import {
  LayoutDashboard,
} from "lucide-react";

const dashboard: Route = { url: () => "/dashboard", label: "Dashboard", icon: LayoutDashboard, };

const fileStorage: Route = { url: () => "/fileStorage", label: "File Storage", icon: LayoutDashboard, };

const baseRoutes = {
  dashboard,
  fileStorage,
} as const;

const ROUTES: Routes<keyof typeof baseRoutes> = baseRoutes;

export default ROUTES;
