import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJournal, updateJournal } from '../../services/journalService';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const EditJournal = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const journal = await getJournal(id);
        setTitle(journal.data.title);
        setContent(journal.data.content);
      } catch (err) {
        setError('Failed to load journal');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJournal();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJournal(id, { title, content });
      navigate(`/journals/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update journal');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Edit Journal</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Content"
            multiline
            rows={10}
            fullWidth
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Journal
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditJournal;