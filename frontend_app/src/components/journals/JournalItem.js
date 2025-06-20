import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const JournalItem = ({ journal, onDelete }) => {
  const { user } = useAuth();

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component={Link} to={`/journals/${journal.id}`}>
          {journal.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          By: {journal.user.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {journal.content.substring(0, 150)}...
        </Typography>
        {user && user.id === journal.user_id && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to={`/edit-journal/${journal.id}`}
              size="small"
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete(journal.id)}
            >
              Delete
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JournalItem;