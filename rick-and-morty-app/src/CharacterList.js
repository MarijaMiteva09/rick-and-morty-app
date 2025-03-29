import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel, Button, Box, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

// GraphQL query to fetch characters
const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $status: String, $species: String) {
    characters(page: $page, filter: { status: $status, species: $species }) {
      results {
        id
        name
        status
        species
        gender
        origin {
          name
        }
        image
      }
      info {
        next
      }
    }
  }
`;

const CharacterList = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [species, setSpecies] = useState('');
  const [language, setLanguage] = useState('en'); // English by default

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page, status, species },
  });

  if (loading && page === 1) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  const loadMoreData = () => {
    setPage(page + 1);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Button variant="contained" onClick={toggleLanguage} sx={{ marginBottom: 2 }}>
        Switch to {language === 'en' ? 'German' : 'English'}
      </Button>

      <Box sx={{ marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel>{language === 'en' ? 'Status' : 'Status'}</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            label={language === 'en' ? 'Status' : 'Status'}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Alive">{language === 'en' ? 'Alive' : 'Lebendig'}</MenuItem>
            <MenuItem value="Dead">{language === 'en' ? 'Dead' : 'Tot'}</MenuItem>
            <MenuItem value="Unknown">{language === 'en' ? 'Unknown' : 'Unbekannt'}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel>{language === 'en' ? 'Species' : 'Spezies'}</InputLabel>
          <Select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            label={language === 'en' ? 'Species' : 'Spezies'}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Human">{language === 'en' ? 'Human' : 'Mensch'}</MenuItem>
            <MenuItem value="Alien">{language === 'en' ? 'Alien' : 'Außerirdisch'}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <InfiniteScroll
        dataLength={data ? data.characters.results.length : 0}
        next={loadMoreData}
        hasMore={data?.characters.info.next}
        loader={<CircularProgress />}
        scrollThreshold={0.95}
        scrollableTarget="scrollableDiv"
      >
        <Grid container spacing={3}>
          {data?.characters.results.map((character) => (
            <Grid item key={character.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                  cursor: 'pointer',
                }}
              >
                <img src={character.image} alt={character.name} style={{ width: '100%' }} />
                <CardContent>
                  <Typography variant="h6">{character.name}</Typography>
                  <Typography variant="body2">{language === 'en' ? 'Status' : 'Status'}: {character.status}</Typography>
                  <Typography variant="body2">{language === 'en' ? 'Species' : 'Spezies'}: {character.species}</Typography>
                  <Typography variant="body2">{language === 'en' ? 'Gender' : 'Geschlecht'}: {character.gender}</Typography>
                  <Typography variant="body2">{language === 'en' ? 'Origin' : 'Herkunft'}: {character.origin.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
};

export default CharacterList;
