import { useEffect, useState } from "react";
import { Typography, Box, Link, Divider } from "@mui/material";
import { useCurrentCampaign } from "./app.context.ts";
import DashboardCharacterSheet from "../components/dashboard/DashboardCharacterSheet.tsx";
import DashboardMain from "../components/dashboard/DashboardMain.tsx";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Campaign() {
    const currentCampaign = useCurrentCampaign();
    const [importData, setImportData] = useState<unknown | undefined>();
    const [editData, setEditData] = useState<unknown | undefined>();
    const [editId, setEditId] = useState<unknown | undefined>();
    const [showCharacterSheet, setShowCharacterSheet] = useState(false);

    const toggleView = async (importData?: unknown, editData?: unknown, editId?: unknown) => {
        if (showCharacterSheet) await currentCampaign?.refresh();
        setImportData(importData);
        setEditData(editData);
        setEditId(editId);
        setShowCharacterSheet(!showCharacterSheet);
    };

    useEffect(() => {
        setShowCharacterSheet(false);
    }, [currentCampaign?._id]);

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
                {showCharacterSheet ? (
                    "Character Sheet"
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>Dashboard</span>
                        {currentCampaign?.name && (
                            <>
                                <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 1 }} />
                                <Typography
                                    component="span"
                                    variant="h4"
                                    sx={{
                                        fontWeight: 'normal',
                                        color: 'text.secondary'
                                    }}
                                >
                                    {currentCampaign.name}
                                </Typography>
                            </>
                        )}
                    </Box>
                )}
            </Typography>
            {showCharacterSheet ? (
                <DashboardCharacterSheet importData={importData} editData={editData} editId={editId} toggleCharacterSheet={toggleView}/>
            ) : (
                <DashboardMain onCreateCharacter={toggleView}/>
            )}
        </>
    );
}
