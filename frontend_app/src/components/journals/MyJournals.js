import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyJournals, deleteJournal } from '../../services/journalService';
import { useAuth } from '../../context/AuthContext';
import { 
  Alert, Button, CircularProgress, Container, 
  Typography, Card, CardContent, Box,
  Paper, Chip
} from '@mui/material';

const useLogger = () => {
  const logsRef = useRef([]);

  const log = (message, data = {}) => {
    const entry = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      data
    };
    console.log(entry);
    logsRef.current = [entry, ...logsRef.current].slice(0, 50);
    return entry;
  };

  return { logsRef, log };
};

const MyJournals = () => {
    const { user } = useAuth();
    const { logsRef, log } = useLogger();
    const [allJournals, setAllJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            log('Fetching all journals from API');
            
            try {
                const response = await getMyJournals();
                
                // Fix: Handle direct array response
                const journalData = Array.isArray(response.data) 
                  ? response.data 
                  : response.data?.data || [];

                log('API response received', journalData);
                setAllJournals(journalData);

            } catch (err) {
                log('Journal fetch failed', { 
                  error: err.message,
                  stack: err.stack 
                });
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter journals by current user
    const myJournals = allJournals.filter(journal => {
      const isOwned = journal.user_id === user?.id;
      if (isOwned) {
        log('Journal belongs to current user', {
          journalId: journal.id,
          userId: user?.id
        });
      }
      return isOwned;
    });

    const handleDelete = async (id) => {
        log('Delete journal initiated', { journalId: id });
        
        if (!window.confirm("Delete this journal?")) return;
        
        try {
            await deleteJournal(id);
            log('Journal deleted successfully', { journalId: id });
            setAllJournals(prev => prev.filter(j => j.id !== id));
        } catch (err) {
            log('Delete failed', { 
              error: err.message,
              journalId: id 
            });
            setError("Failed to delete journal");
        }
    };

    if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
    
    if (error) {
        return (
            <Container>
                <Alert severity="error" sx={{ m: 2 }}>
                    {error}
                    <Button onClick={() => window.location.reload()} sx={{ ml: 2 }}>
                        Retry
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">My Journals</Typography>
                <Button variant="contained" onClick={() => navigate('/create-journal')}>
                    Create New
                </Button>
            </Box>

            {myJournals.length === 0 ? (
                <Typography>No journals found for your account.</Typography>
            ) : (
                myJournals.map(journal => (
                    <Card key={journal.id} sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {journal.title}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip label={`Created: ${new Date(journal.created_at).toLocaleDateString()}`} />
                                <Chip label={`Author: ${journal.user?.name}`} />
                            </Box>
                            <Typography sx={{ mb: 3 }}>
                                {journal.content}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button variant="outlined" onClick={() => navigate(`/edit-journal/${journal.id}`)}>
                                    Edit
                                </Button>
                                <Button variant="outlined" color="error" onClick={() => handleDelete(journal.id)}>
                                    Delete
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};


export default MyJournals;