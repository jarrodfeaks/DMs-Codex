import { Box, Button, Dialog, Typography } from "@mui/material";
import { useState } from "react";

export default function ImportCharacterModal({ open, onClose }: { open: boolean, onClose: () => void }) {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const onImport = async () => {
        onClose();
        setSelectedFile(null);
        // Read PDF data, go to the Character Sheet screen, and fill in with data
    };

    // PDF upload
    const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/pdf") { setSelectedFile(file); }
        else { alert("Please upload a PDF file."); }
    };

    const onCancel = () => {
        setSelectedFile(null);
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
                <Box sx={{ mb: 2 }}>
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
                        <Typography sx={{ mt: 1, display: 'inline-block' }}>
                            {selectedFile.name}
                        </Typography>
                    )}
                </Box>

                {/* Import Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={onCancel} color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={onImport}
                        variant="contained"
                        color="primary"
                        disabled={!selectedFile}
                    >
                        Import
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
