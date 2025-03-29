// src/CharacterList.js
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <div>
      <div>
        <button onClick={toggleLanguage}>Switch to {language === 'en' ? 'German' : 'English'}</button>
      </div>

      <ul>
        {data.characters.results.map((character) => (
          <li key={character.id}>
            <h3>{character.name}</h3>
            <p>{language === 'en' ? 'Status' : 'Status'}: {character.status}</p>
            <p>{language === 'en' ? 'Species' : 'Spezies'}: {character.species}</p>
            <p>{language === 'en' ? 'Gender' : 'Geschlecht'}: {character.gender}</p>
            <p>{language === 'en' ? 'Origin' : 'Herkunft'}: {character.origin.name}</p>
          </li>
        ))}
      </ul>

      {data.characters.info.next && (
        <button onClick={() => setPage(page + 1)}>Load More</button>
      )}
    </div>
  );
};

export default CharacterList;
