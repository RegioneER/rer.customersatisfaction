import Box from '@mui/material/Box';
import CommentsTable from './CommentsTable'

const Comments = () => {
  return (
    <Box sx={{
      width: "98%",
      mt: 5,
      ml: "auto",
      mr: "auto"
    }}>
      <CommentsTable />
    </Box>
  )
}

export default Comments;
