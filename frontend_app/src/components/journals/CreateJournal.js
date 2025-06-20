import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createJournal } from '../../services/journalService';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

const CreateJournal = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!user) {
      setError('You must be logged in to create a journal');
      setLoading(false);
      navigate('/login');  // Redirect to login if not authenticated
      return;
    }

    try {
      await createJournal({
        title: formData.title,
        content: formData.content,
        user_id: user.id  // Include the logged-in user's ID
      });
      navigate('/my-journals');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create journal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Create New Journal</Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <TextField
            label="Content"
            name="content"
            multiline
            rows={10}
            fullWidth
            margin="normal"
            value={formData.content}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Creating...' : 'Create Journal'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default CreateJournal;