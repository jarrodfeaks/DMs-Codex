import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  Button, 
  Paper, 
  Container 
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
  onNewCampaign: () => void;
  onLoadCampaign: () => void;
  onSignOut: () => void;
}

const Home: React.FC<HomeProps> = ({ 
  username, 
  campaigns, 
  onCampaignSelect, 
  onNewCampaign, 
  onLoadCampaign, 
  onSignOut 
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);

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

  return (
    <Container>
      {/* Welcome message with the user's username */}
      <Typography variant="h4" gutterBottom className="welcomeMessage">
        Welcome {username}!
      </Typography>

      {/* Campaign list container with scrolling */}
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Campaign List</Typography>
        
        {/* Scrollable box containing the list of campaigns */}
        <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 2 }}>
          <List>
            {/* Sort campaigns by most recently opened */}
            {campaigns
              .sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime()) // Sort by last opened
              .map((campaign) => (
                <ListItem key={campaign.id}>
                  <ListItemButton
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
        <Button variant="contained" onClick={onNewCampaign}>
          New Campaign
        </Button>

        {/* Sign out */}
        <Button variant="outlined" onClick={onSignOut}>
          Sign Out
        </Button>
      </Box>
    </Container>
  );
};

// Temp functions for testing
const mockOnCampaignSelect = (id: number) => console.log(`Campaign selected: ${id}`);
const mockOnNewCampaign = () => console.log('New Campaign modal opened');
const mockOnLoadCampaign = () => console.log('Campaign loaded');
const mockOnSignOut = () => console.log('Signed out');

// Temp functionality for testing
const App = () => (
  <Home
    username="Test User"
    campaigns={dummyCampaigns}
    onCampaignSelect={mockOnCampaignSelect}
    onNewCampaign={mockOnNewCampaign}
    onLoadCampaign={mockOnLoadCampaign}
    onSignOut={mockOnSignOut}
  />
);

export default App;
