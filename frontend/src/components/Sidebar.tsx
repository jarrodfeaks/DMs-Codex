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

export default function Sidebar({ user, campaigns, currentCampaign }: { user: User, campaigns: Campaign[], currentCampaign: Campaign | undefined }) {
    const navigate = useNavigate();

    const [ expanded, setExpanded ] = useState(true);

    const getCampaigns = () => {
        return campaigns.map((campaign) => {
            return (
                <ListItemButton key={campaign.id} sx={{ pl: 4 }} onClick={() => handleOpenCampaign(campaign.id)}>
                    <ListItemText primary={campaign.name} />
                </ListItemButton>
            )
        })
    }

    const handleOpenCampaign = (id: number) => {
        navigate(`/app/campaigns/${id}`);
    }

    return (
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
                    <ListItemButton onClick={() => setExpanded(!expanded)}>
                        <ListItemIcon sx={{ minWidth: 0, pr: 2 }}>
                            <AutoStories />
                        </ListItemIcon>
                        <ListItemText primary="My Campaigns" />
                        {expanded ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            { getCampaigns() }
                            <ListItemButton sx={{ pl: 4 }}>
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
    )
}
