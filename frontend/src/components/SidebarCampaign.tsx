import {Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {AutoAwesome, Casino, Home} from "@mui/icons-material";
import {Campaign} from "../types.ts";
import { useMatches, useNavigate} from "react-router-dom";

export default function SidebarCampaign({ campaign }: { campaign: Campaign }) {
    const navigate = useNavigate();

    const handleNavigate = (to: "dashboard" | "encounters" | "assistant") => {
        switch (to) {
            case "dashboard":
                navigate(`/app/campaigns/${campaign.id}`);
                break;
            case "encounters":
                navigate(`/app/campaigns/${campaign.id}/encounters/1`);
                break;
            case "assistant":
                navigate(`/app/campaigns/${campaign.id}/assistant`);
                break
        }
    }

    const matches = useMatches();
    const location = matches.find(match => ["campaign", "encounter", "assistant"].includes(match.id))?.id;

    const sxListIcon = { minWidth: 0, pr: 2 };

    return (
        <>
            <Divider />
            <List>
                <ListItem>
                    <ListItemText primary={campaign.name} primaryTypographyProps={{ variant: "subtitle2", color: 'textSecondary' }} />
                </ListItem>
                <ListItemButton selected={location === "campaign"} onClick={() => handleNavigate("dashboard")}>
                    <ListItemIcon sx={sxListIcon}>
                        <Home />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton selected={location === "encounter"} onClick={() => handleNavigate("encounters")}>
                    <ListItemIcon sx={sxListIcon}>
                        <Casino />
                    </ListItemIcon>
                    <ListItemText primary="Encounters" />
                </ListItemButton>
                <ListItemButton selected={location === "assistant"} onClick={() => handleNavigate("assistant")}>
                    <ListItemIcon sx={sxListIcon}>
                        <AutoAwesome />
                    </ListItemIcon>
                    <ListItemText primary="Smart Assistant" />
                </ListItemButton>
            </List>
        </>
    )
}
