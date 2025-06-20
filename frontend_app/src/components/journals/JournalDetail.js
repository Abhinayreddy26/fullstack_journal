import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJournal, deleteJournal } from '../../services/journalService';
import { useAuth } from '../../context/AuthContext';
import { 
  Typography, Button, Container, Box, Card, CardContent,
  CircularProgress, Alert, Divider
} from '@mui/material';
import { format } from 'date-fns';

const JournalDetail = () => {
  const { id } = useParams();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await getJournal(id);
        console.log('Full API response:', response); // Debug log
        
        // Fix: Access the nested data property
        if (response && response.data) {
          setJournal(response.data);
        } else {
          throw new Error('Invalid journal data structure');
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to load journal');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournal();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this journal?')) {
      try {
        await deleteJournal(id);
        navigate('/journals');
      } catch (err) {
        setError('Failed to delete journal');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not available';
      return format(new Date(dateString), 'MMMM d, yyyy \'at\' h:mm a');
    } catch {
      return 'Invalid date format';
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!journal) return <Typography>Journal not found</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {journal.title || 'Untitled Journal'}
          </Typography>
          
          <Typography color="text.secondary" gutterBottom>
            Last updated: {formatDate(journal.updated_at)}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography sx={{ whiteSpace: 'pre-line' }}>
            {journal.content || 'No content available'}
          </Typography>

          {user && user.id === journal.user_id && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained"
                onClick={() => navigate(`/edit-journal/${id}`)}
              >
                Edit
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default JournalDetail;