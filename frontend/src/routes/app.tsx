import {useEffect, useState} from 'react'
import {Box} from "@mui/material";
import Sidebar from "../components/Sidebar.tsx";
import { Outlet, useLoaderData, useMatch } from "react-router-dom";
import Start from "./start.tsx";
import {Campaign, User} from "../types.ts";
import { DialogsProvider } from '@toolpad/core/useDialogs';

export type ContextType = {
    currentCampaign: Campaign | undefined;
    user: User;
};

function App() {
    const userData = useLoaderData() as { user: User; campaigns: Campaign[] };

    const atRoot: boolean = !!useMatch("/app");

    const [ currentCampaign, setCurrentCampaign ] = useState<Campaign | undefined>(undefined);

    const campaignId = useMatch("/app/campaigns/:campaignId/*")?.params.campaignId;

    useEffect(() => {
        const campaign = campaignId ? userData.campaigns.find(c => c._id === campaignId) : undefined;
        setCurrentCampaign(campaign);
    }, [campaignId, userData.campaigns]);

    return (
        <>
            <DialogsProvider>
                <Box sx={{ display: 'flex' }}>
                    <Sidebar user={userData.user} campaigns={userData.campaigns} currentCampaign={currentCampaign} />
                    <Box sx={{ width: "100%", height: "100vh", p: 2 }}>
                        { atRoot ? <Start /> : <Outlet context={{ currentCampaign, user: userData.user } satisfies ContextType} /> }
                    </Box>
                </Box>
            </DialogsProvider>
        </>
    )
}

export default App
