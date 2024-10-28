import {useEffect, useState} from 'react'
import {Box} from "@mui/material";
import Sidebar from "../components/Sidebar.tsx";
import { Outlet, useLoaderData, useMatch, useNavigate } from "react-router-dom";
import Start from "./start.tsx";
import {Campaign, User} from "../types.ts";
import { DialogsProvider } from '@toolpad/core/useDialogs';
import { apiService } from '../services/apiService.ts';

type CurrentCampaign = Campaign & { refresh: () => Promise<void> };

export type ContextType = {
    currentCampaign: CurrentCampaign | undefined;
    user: User;
};

function App() {
    const userData = useLoaderData() as { user: User; campaigns: Campaign[] };
    const navigate = useNavigate();

    const atRoot: boolean = !!useMatch("/app");

    const [ currentCampaign, setCurrentCampaign ] = useState<CurrentCampaign | undefined>(undefined);

    const campaignId = useMatch("/app/campaigns/:campaignId/*")?.params.campaignId;

    useEffect(() => {
        const refreshCampaign = async () => {
            if (campaignId) {
                try {
                    const response = await apiService.get(`/campaigns/${campaignId}`);
                    userData.campaigns = userData.campaigns.map(c =>
                        c._id === campaignId ? response : c
                    );
                    setCurrentCampaign({ ...response, refresh: refreshCampaign });
                } catch (error) {
                    console.error('Error refreshing campaign:', error);
                }
            }
        };

        const campaign = campaignId ? userData.campaigns.find(c => c._id === campaignId) : undefined;
        setCurrentCampaign(campaign ? { ...campaign, refresh: refreshCampaign } : undefined);
    }, [campaignId, userData]);

    useEffect(() => {
        if (atRoot && userData.campaigns.length > 0) {
            const firstCampaign = userData.campaigns[0];
            navigate(`/app/campaigns/${firstCampaign._id}`);
        }
    }, [atRoot, userData.campaigns, navigate]);

    return (
        <>
            <DialogsProvider>
                <Box sx={{ display: 'flex' }}>
                    <Sidebar user={userData.user} campaigns={userData.campaigns} currentCampaign={currentCampaign} />
                    <Box sx={{ width: "100%", height: "100vh", p: 2 }}>
                        {atRoot && userData.campaigns.length === 0 ? (
                            <Start />
                        ) : (
                            <Outlet context={{ currentCampaign, user: userData.user } satisfies ContextType} />
                        )}
                    </Box>
                </Box>
            </DialogsProvider>
        </>
    )
}

export default App
