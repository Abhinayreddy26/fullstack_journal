import { useState } from 'react';
import { searchJournals } from '../../services/journalService';
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const JournalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const journals = await searchJournals(query);
      setResults(journals.data);
      setSearchPerformed(true);
    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Search Journals</Typography>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Search query"
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Box>
        </form>

        {searchPerformed && (
          <Box>
            <Typography variant="h6" gutterBottom>
              {results.length} results found
            </Typography>
            <List>
              {results.map((journal) => (
                <ListItem key={journal.id} divider>
                  <ListItemText
                    primary={journal.title}
                    secondary={journal.content.substring(0, 100) + '...'}
                  />
                </ListItem>
              ))}
              {results.length === 0 && (
                <Typography>No journals found matching your search.</Typography>
              )}
            </List>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default JournalSearch;