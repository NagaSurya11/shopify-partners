import { createBrowserRouter } from "react-router-dom";
import { DashboardModule } from "../dashboard/dashboard.module"
import { CreateBundleModule } from "../create-bundle/create-bundle.module";
import { EditBundleModule } from "../edit-bundle/edit-bundle-module";

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { Core } = await import('../core/core'); // Lazy load the Core component
      return { Component: Core };
    },
    children: [
      {
        index: true,
        lazy: DashboardModule
      },
      {
        path: 'create-bundle',
        lazy: CreateBundleModule
      },
      {
        path: 'edit-bundle',
        lazy: EditBundleModule
      }
    ],
  },
]);