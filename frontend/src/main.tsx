import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import App from './routes/app.tsx'
import Landing from "./routes/landing.tsx";
import Campaign from "./routes/campaign.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./assets/theme.ts";
import Encounter from "./routes/encounter.tsx";
import Assistant from "./routes/assistant.tsx";

const getUser = async () => {
    const res = await fetch('/api/profile');

    if (res.ok) return res.json();
    else if (res.status === 401) return undefined;
    throw new Error(`Error authenticating: ${res.status} ${res.statusText}`);
}

// we can fetch this from the backend later
const exampleCampaigns = [
    {
        id: 1,
        name: "Campaign 1",
    },
    {
        id: 2,
        name: "Campaign 2"
    }
]

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
            const campaigns = exampleCampaigns;
            if (!user) return redirect("/");
            return { user, campaigns };
        },
        children: [
            {
                path: "campaigns/:campaignId",
                element: <Campaign />,
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
