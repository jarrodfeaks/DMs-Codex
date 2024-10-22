import {
    Avatar,
    Collapse,
    Divider,
    Drawer, IconButton,
    List, ListItem, ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack
} from '@mui/material';
import {Campaign, User} from "../types.ts";
import { useState } from "react";
import {Add, AutoStories, ExpandLess, ExpandMore, Logout} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SidebarCampaign from "./SidebarCampaign.tsx";
import CreateCampaign from "./modals/CreateCampaign.tsx";
import { useDialogs } from "@toolpad/core/useDialogs";

export default function Sidebar({ user, campaigns, currentCampaign }: { user: User, campaigns: Campaign[], currentCampaign: Campaign | undefined }) {
    const navigate = useNavigate();
    const dialogs = useDialogs();

    const [ campaignExpanded, setCampaignExpanded ] = useState(true);

    const getCampaigns = () => {
        return campaigns.map((campaign) => {
            const isCurrentCampaign = currentCampaign && campaign._id === currentCampaign._id;
            return (
                <ListItemButton
                    key={campaign._id}
                    sx={{
                        pl: 4,
                        position: 'relative',
                        '&::before': isCurrentCampaign ? {
                            content: '""',
                            position: 'absolute',
                            left: '0.5rem',
                            top: "20%",
                            bottom: "20%",
                            width: '0.25rem',
                            backgroundColor: 'primary.main',
                            borderRadius: '2px',
                        } : {}
                    }}
                    onClick={() => handleOpenCampaign(campaign._id)}
                >
                    <ListItemText primary={campaign.name} />
                </ListItemButton>
            )
        })
    }

    const handleOpenCampaign = (id: string) => {
        navigate(`/app/campaigns/${id}`);
    }

    const handleOpenNewCampaignModal = async () => {
        const res = await dialogs.open(CreateCampaign, user);
        if (res) {
            campaigns.push(res);
        }
    };

    return (
        <>
            <Drawer variant="permanent" anchor="left" sx={{
                width: 300,
                '& .MuiDrawer-paper': {
                    width: 300,
                },
            }} PaperProps={{ elevation: 1 }}>
                <Stack>
                    <List>
                        <ListItem secondaryAction={<a href="/api/logout"><IconButton><Logout /></IconButton></a>}>
                        <ListItemAvatar>
                            <Avatar src={user.picture} />
                        </ListItemAvatar>
                        <ListItemText primary={user.nickname} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItemButton onClick={() => setCampaignExpanded(!campaignExpanded)}>
                            <ListItemIcon sx={{ minWidth: 0, pr: 2 }}>
                                <AutoStories />
                            </ListItemIcon>
                            <ListItemText primary="My Campaigns" />
                            {campaignExpanded ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={campaignExpanded} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                { getCampaigns() }
                                <ListItemButton sx={{ pl: 4 }} onClick={handleOpenNewCampaignModal}>
                                    <ListItemIcon sx={{ minWidth: 0, pr: 1 }}>
                                        <Add />
                                    </ListItemIcon>
                                    <ListItemText primary="Add new..." />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List>
                    { currentCampaign && <SidebarCampaign campaign={currentCampaign} /> }
                </Stack>
            </Drawer>
        </>
    )
}
