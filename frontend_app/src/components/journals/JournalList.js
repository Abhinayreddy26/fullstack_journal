import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getJournals } from '../../services/journalService';
import { Card, CardContent, Typography, Container, Grid, CircularProgress, Box } from '@mui/material';

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await getJournals();
        setJournals(response.data || []);
      } catch (err) {
        console.error('Failed to fetch journals:', err);
        setError('Failed to load journals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournals();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  if (journals.length === 0) {
    return (
      <Container>
        <Typography variant="h6">No journals found</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>All Journals</Typography>
      <Grid container spacing={3}>
        {journals.map((journal) => (
          <Grid item xs={12} sm={6} md={4} key={journal.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component={Link} to={`/journals/${journal.id}`}>
                  {journal.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By: {journal.user?.name || 'Unknown author'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {journal.content?.substring(0, 100) || 'No content'}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default JournalList;