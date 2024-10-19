import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import App from './routes/app.tsx'
import Landing from "./routes/landing.tsx";
import CampaignDashboard from "./routes/campaign.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./assets/theme.ts";
import Encounter from "./routes/encounter.tsx";
import Assistant from "./routes/assistant.tsx";
import "./index.css";
import { apiService } from "./services/apiService.ts";
import { Campaign, User } from "./types.ts";

const getUser = async (): Promise<User | undefined> => {
    const res = await apiService.get("/profile", { throwOnError: false, returnRawResponse: true });

    if (res.ok) return res.json();
    else if (res.status === 401) return undefined;
    throw new Error(`Error authenticating: ${res.status} ${res.statusText}`);
}

const getCampaigns = async (user: User): Promise<Campaign[]> => {
    const res = await apiService.get(`campaigns/dm/${user.sub}`, { throwOnError: false, returnRawResponse: true });

    if (res.ok) return res.json();
    else if (res.status === 404) return [];
    throw new Error(`Error retrieving campaigns: ${res.status} ${res.statusText}`);
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
        loader: async () => {
            const user = await getUser();
            if (user) return redirect("/app");
            return null;
        }
    },
    {
        path: "app",
        element: <App />,
        loader: async () => {
            const user = await getUser();
            if (!user) return redirect("/");
            const campaigns = await getCampaigns(user);
            return { user, campaigns };
        },
        children: [
            {
                path: "campaigns/:campaignId",
                element: <CampaignDashboard />,
                id: "campaign"
            },
            {
                path: "campaigns/:campaignId/encounters/:encounterId",
                element: <Encounter />,
                id: "encounter"
            },
            {
                path: "campaigns/:campaignId/assistant",
                element: <Assistant />,
                id: "assistant"
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
      </ThemeProvider>
  </StrictMode>,
)
