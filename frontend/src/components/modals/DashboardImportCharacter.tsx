import { Alert, Box, Button, Dialog, Typography } from "@mui/material";
import { useState } from "react";
import { apiService } from "../../services/apiService.ts";
import AttachmentIcon from '@mui/icons-material/Attachment';

export default function DashboardImportCharacter({ open, onClose }: { open: boolean, onClose: (result?: unknown) => Promise<void> }) {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [importing, setImporting] = useState(false);
    const [importError, setImportError] = useState<string | null>(null);

    const onImport = async () => {
        if (!selectedFile) return;
        setImporting(true);
        setImportError(null);
        try {
            const fd = new FormData();
            fd.append('file', selectedFile);
            const res = await apiService.post("/ai/character/import", fd);
            onClose(res);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            setImportError(`Failed to import character sheet: ${message}`);
        } finally {
            setImporting(false);
        }
    };

    // PDF upload
    const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") { setSelectedFile(file); }
        else { alert("Please upload a PDF file."); }
    };

    const onCancel = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                setSelectedFile(null);
                onClose();
            }}
        >
            <Box sx={{
                width: 400,
                bgcolor: 'background.paper',
                p: 4,
            }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Import Character
                </Typography>

                {/* PDF Upload */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button variant="outlined" component="label">
                        Upload PDF
                        <input
                            type="file"
                            accept="application/pdf"
                            hidden
                            onChange={onUpload}
                        />
                    </Button>
                    {selectedFile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachmentIcon />
                            <Typography variant="body2">{selectedFile.name}</Typography>
                        </Box>
                    )}
                    {importError && (
                        <Alert variant="outlined" severity="error" sx={{ mt: 1 }}>{importError}</Alert>
                    )}
                </Box>

                {/* Import Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onImport}
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile || importing}
                    >
                        {importing ? "Importing..." : "Import"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
