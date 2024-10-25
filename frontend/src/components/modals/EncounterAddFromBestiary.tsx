import { useState, useEffect } from 'react';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Typography,
  Button,
  Dialog,
  Paper,
} from '@mui/material';
import { formatMonsterForMongo } from '../../utils';
import { apiService } from "../../services/apiService.ts";

function EncounterAddFromBestiary({ open, onClose }: { open: boolean, onClose: (monster?: unknown, monsterId?: string) => void }) {

  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState('');
  const [monsterDetails, setMonsterDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); // Sorting state

  const apiUrl = 'https://www.dnd5eapi.co/api/monsters';

  // Check if monster data is already saved locally
  const loadMonsters = async () => {
    const storedMonsters = localStorage.getItem('monsters'); // Check if it's in localStorage
    localStorage.removeItem('monsters');

    if (storedMonsters) {
      // Load from localStorage if data is available
      console.log('Loading monsters from localStorage');
      setMonsters(JSON.parse(storedMonsters));
      setLoading(false);
    } else {
      // Fetch from API if no data in localStorage
      console.log('Fetching monsters from API');
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Fetch details for each monster
      const monstersWithDetails = await Promise.all(
        data.results.map(async (monster: any) => {
          const detailsResponse = await fetch(`${apiUrl}/${monster.index}`);
          const details = await detailsResponse.json();

          return {
            name: details.name,
            index: details.index,
            hit_points: details.hit_points || 'N/A',  // Fallback to 'N/A' if not available
            challenge_rating: details.challenge_rating || 'N/A',
            armor_class: Array.isArray(details.armor_class)
              ? details.armor_class[0]?.value || 'N/A'  // Handle array with fallback
              : details.armor_class || 'N/A',  // Fallback to 'N/A' if no armor class
          };
        })
      );

      // Save monsters to localStorage for future use
      localStorage.setItem('monsters', JSON.stringify(monstersWithDetails));
      setLoading(false);
      setMonsters(monstersWithDetails);
    }
  };

  useEffect(() => {
    loadMonsters();
  }, []);

  const handleSelectMonster = (index: string) => {
    setSelectedMonster(index);
  };

  const handleSort = (key: string) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    setMonsters((prevMonsters) =>
      [...prevMonsters].sort((a, b) => {
        if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    );
  };

  const handleAddMonsterToQueue = async () => {
    const formattedMonster = selectedMonster.toLowerCase().replace(/\s+/g, '-');
    // Fetch specific monster details
    const apiResponse = await fetch(`${apiUrl}/${formattedMonster}`);
    const formattedMonsterForMongo = formatMonsterForMongo(await apiResponse.json());
    try {
      // Add monster to database
      const mongoDbResponse = await apiService.post("/monsters", formattedMonsterForMongo);
      const _id = mongoDbResponse._id;
      onClose({ monsterDetails, _id });
    } catch (error) {
      console.error('Error adding monster to database:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="lg">
      <Box sx={{ width: 800, bgcolor: 'background.paper', p: 2 }}>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Add from bestiary
          </Typography>

          <Box>
            {loading ? (
              <CircularProgress />
            ) : (
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'name'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('name')}
                      >
                        Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'hit_points'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('hit_points')}
                      >
                        Hit Points
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'armor_class'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('armor_class')}
                      >
                        Armor Class
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortConfig.key === 'challenge_rating'}
                        direction={sortConfig.direction}
                        onClick={() => handleSort('challenge_rating')}
                      >
                        Challenge Rating
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monsters.map((monster) => (
                    <TableRow
                      key={monster.index}
                      onClick={() => handleSelectMonster(monster.index)}
                      selected={monster.index === selectedMonster}
                    >
                      <TableCell>{monster.name}</TableCell>
                      <TableCell>{monster.hit_points}</TableCell>
                      <TableCell>{monster.armor_class}</TableCell>
                      <TableCell>{monster.challenge_rating}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>

          <Box sx={{ mt: 2, p: 2,  position: 'sticky', bottom: 0 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddMonsterToQueue}
              disabled={!selectedMonster}
            >
              Add to initiative queue
            </Button>
          </Box>
        </Paper>
      </Box>
    </Dialog>
  );
}

export default EncounterAddFromBestiary;
