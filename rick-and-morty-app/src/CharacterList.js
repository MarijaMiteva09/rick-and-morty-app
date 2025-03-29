import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';


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

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: { page, status, species },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div>
        <label>Status: </label>
        <select onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="">All</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>

      <div>
        <label>Species: </label>
        <select onChange={(e) => setSpecies(e.target.value)} value={species}>
          <option value="">All</option>
          <option value="Human">Human</option>
          <option value="Alien">Alien</option>
        </select>
      </div>

      <ul>
        {data.characters.results.map((character) => (
          <li key={character.id}>
            <h3>{character.name}</h3>
            <p>Status: {character.status}</p>
            <p>Species: {character.species}</p>
            <p>Gender: {character.gender}</p>
            <p>Origin: {character.origin.name}</p>
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
