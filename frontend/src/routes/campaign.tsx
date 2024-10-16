import { useState } from "react";
import { Typography, Box, Link } from "@mui/material";
import { useCurrentCampaign } from "./app.context.ts";
import DashboardCharacterSheet from "../components/dashboard/DashboardCharacterSheet.tsx";
import DashboardMain from "../components/dashboard/DashboardMain.tsx";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Campaign() {
    const { currentCampaign } = useCurrentCampaign();
    const [importData, setImportData] = useState<unknown | undefined>();
    const [showCharacterSheet, setShowCharacterSheet] = useState(false);

    const toggleView = (importData?: unknown) => {
        setImportData(importData);
        setShowCharacterSheet(!showCharacterSheet);
    };

    return (
        <>
            {showCharacterSheet && (
                <Box sx={{ mb: 2 }}>
                    <Link
                        component="button"
                        onClick={toggleView}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        <ArrowBackIcon sx={{ mr: 0.5, fontSize: 'medium' }} />
                        Back to dashboard
                    </Link>
                </Box>
            )}
            <Typography variant="h3" sx={{ mb: 2 }}>
                {showCharacterSheet ? "Character Sheet" : `Dashboard - ${currentCampaign?.name}`}
            </Typography>
            {showCharacterSheet ? (
                <DashboardCharacterSheet importData={importData} />
            ) : (
                <DashboardMain onCreateCharacter={toggleView} />
            )}
        </>
    );
}
