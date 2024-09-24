import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Button,
  Paper,
  Container,
  Modal,
  TextField,
} from '@mui/material';

// Dummy Campaign Data
const dummyCampaigns = [
  { id: 1, name: 'Campaign 1', lastOpened: new Date('2024-01-01') },
  { id: 2, name: 'Campaign 2', lastOpened: new Date('2024-01-02') },
  { id: 3, name: 'Campaign 3', lastOpened: new Date('2024-01-03') },
  { id: 4, name: 'Campaign 4', lastOpened: new Date('2024-01-04') },
  { id: 5, name: 'Campaign 5', lastOpened: new Date('2024-01-05') },
  { id: 6, name: 'Campaign 6', lastOpened: new Date('2024-01-06') },
  { id: 7, name: 'Campaign 7', lastOpened: new Date('2024-01-07') },
  { id: 8, name: 'Campaign 8', lastOpened: new Date('2024-01-08') },
  { id: 9, name: 'Campaign 9', lastOpened: new Date('2024-01-09') },
  { id: 10, name: 'Campaign 10', lastOpened: new Date('2024-01-10') },
  { id: 11, name: 'Campaign 11', lastOpened: new Date('2024-01-11') },
  { id: 12, name: 'Campaign 12', lastOpened: new Date('2024-01-12') },
];

interface Campaign {
  id: number;
  name: string;
  lastOpened: Date;
}

// Props interface for the Home page
interface HomeProps {
  username: string;
  campaigns: Campaign[];
  onCampaignSelect: (id: number) => void;
  onCampaignCreate: (name: string) => void; // New prop for creating campaign
  onLoadCampaign: () => void;
  onSignOut: () => void;
}

const Home: React.FC<HomeProps> = ({
  username,
  campaigns,
  onCampaignSelect,
  onCampaignCreate,
  onLoadCampaign,
  onSignOut,
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false); // State for modal
  const [newCampaignName, setNewCampaignName] = useState(''); // State for campaign name input

  // Click on a campaign in the list to select it
  const handleCampaignClick = (id: number) => {
    setSelectedCampaign(id);
    onCampaignSelect(id);
  };

  // Double-click on a campaign to directly load it
  const handleDoubleClick = () => {
    if (selectedCampaign !== null) {
      onLoadCampaign();
    }
  };

  // Open modal
  const handleNewCampaignClick = () => {
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewCampaignName(''); // Reset input
  };

  // New campaign
  const handleCreateCampaign = () => {
    if (newCampaignName.trim()) {
      onCampaignCreate(newCampaignName);
      handleCloseModal(); 
    }
  };

  return (
    <Container>
      {/* Welcome message with the user's username */}
      <Typography gutterBottom className="title">
        Welcome {username}!
      </Typography>

      {/* Campaign list container with scrolling */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography className="h1">Campaign List</Typography>

        {/* Scrollable box containing the list of campaigns */}
        <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2 }}>
          <List>
            {/* Sort campaigns by most recently opened */}
            {campaigns
              .sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()) // Sort by last opened
              .map((campaign) => (
                <ListItem key={campaign.id}>
                  <ListItemButton
                    className="normal"
                    selected={selectedCampaign === campaign.id} // Highlight if selected
                    onClick={() => handleCampaignClick(campaign.id)} // Handle click event
                    onDoubleClick={handleDoubleClick} // Handle double-click event
                  >
                    {campaign.name} {/* Display the campaign name */}
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
      </Paper>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Load Campaign button is disabled if no campaign is selected */}
        <Button
          variant="contained"
          onClick={onLoadCampaign}
          disabled={selectedCampaign === null} // Disable if no campaign selected
        >
          Load Campaign
        </Button>

        {/* Create a new campaign */}
        <Button variant="contained" onClick={handleNewCampaignClick}>
          New Campaign
        </Button>

        {/* Sign out */}
        <Button variant="outlined" onClick={onSignOut}>
          Sign Out
        </Button>
      </Box>

      {/* Create Campaign Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ 
          width: 400, 
          bgcolor: 'background.paper', 
          borderRadius: 2, 
          p: 4, 
          mx: 'auto', 
          mt: '20%', 
          boxShadow: 24 
        }}>
          <Typography gutterBottom className="h1">
            Create New Campaign
          </Typography>
          <TextField
            fullWidth
            label="Campaign Name"
            value={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value)} // Update campaign name state
            variant="outlined"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button
              onClick={handleCreateCampaign}
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              disabled={!newCampaignName.trim()} // Disable if the input is empty
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

// Temp functions for testing
const mockOnCampaignSelect = (id: number) => console.log(`Campaign selected: ${id}`);
const mockOnCampaignCreate = (name: string) => console.log(`New campaign created: ${name}`);
const mockOnLoadCampaign = () => console.log('Campaign loaded');
const mockOnSignOut = () => console.log('Signed out');

// Temp functionality for testing
const App = () => (
  <Home
    username="Test User"
    campaigns={dummyCampaigns}
    onCampaignSelect={mockOnCampaignSelect}
    onCampaignCreate={mockOnCampaignCreate} // Pass the new function
    onLoadCampaign={mockOnLoadCampaign}
    onSignOut={mockOnSignOut}
  />
);

export default App;
