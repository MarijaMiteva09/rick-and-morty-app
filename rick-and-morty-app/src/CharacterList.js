import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [language, setLanguage] = useState('en');
  const [sort, setSort] = useState('');

  const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
    variables: { page, status, species },
  });

  if (loading && page === 1) return <div className="text-center mt-4">Loading...</div>;
  if (error) return <p className="text-danger">Error: {error.message}</p>;

  // Handle client-side sorting by Name or Origin
  const sortedCharacters = data?.characters.results.slice().sort((a, b) => {
    if (sort === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sort === 'origin') {
      return a.origin.name.localeCompare(b.origin.name);
    }
    return 0; // No sorting if no sort option selected
  });

  const loadMoreData = () => {
    setPage((prevPage) => prevPage + 1);
    fetchMore({ variables: { page: page + 1, status, species } });
  };

  return (
    <div className="container mt-4">
      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label className="form-label">{language === 'en' ? 'Status' : 'Status'}</label>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{language === 'en' ? 'All' : 'Alle'}</option>
            <option value="Alive">{language === 'en' ? 'Alive' : 'Lebendig'}</option>
            <option value="Dead">{language === 'en' ? 'Dead' : 'Tot'}</option>
            <option value="Unknown">{language === 'en' ? 'Unknown' : 'Unbekannt'}</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">{language === 'en' ? 'Species' : 'Spezies'}</label>
          <select className="form-select" value={species} onChange={(e) => setSpecies(e.target.value)}>
            <option value="">{language === 'en' ? 'All' : 'Alle'}</option>
            <option value="Human">{language === 'en' ? 'Human' : 'Mensch'}</option>
            <option value="Alien">{language === 'en' ? 'Alien' : 'Außerirdisch'}</option>
          </select>
        </div>

        <div className="col-md-4">
          {/* Language Switcher Button */}
          <label className="form-label">{language === 'en' ? 'Language' : 'Sprache'}</label>
          <button
            className="btn btn-primary w-100"
            onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
          >
            {language === 'en' ? 'Switch to German' : 'Switch to English'}
          </button>
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">{language === 'en' ? 'Sort By' : 'Sortieren nach'}</label>
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">{language === 'en' ? 'None' : 'Keiner'}</option>
            <option value="name">{language === 'en' ? 'Name' : 'Name'}</option>
            <option value="origin">{language === 'en' ? 'Origin' : 'Herkunft'}</option>
          </select>
        </div>
      </div>

      {/* Scrollable Character List */}
      <div
        id="scrollableDiv"
        className="border p-3"
        style={{
          height: '500px', // Fixed height so only 6 cards are visible
          overflowY: 'auto', // Enables internal scrolling
        }}
      >
        <InfiniteScroll
          dataLength={sortedCharacters ? sortedCharacters.length : 0}
          next={loadMoreData}
          hasMore={data?.characters.info.next}
          loader={<div className="text-center">Loading more...</div>}
          scrollableTarget="scrollableDiv"
        >
          <div className="row">
            {sortedCharacters?.map((character) => (
              <div key={character.id} className="col-md-4 mb-3">
                <div className="card">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="card-img-top"
                    style={{ objectFit: 'contain', height: '200px' }} // Prevents image cropping
                  />
                  <div className="card-body">
                    <h6 className="card-title">{character.name}</h6>
                    <p className="card-text">
                      {language === 'en' ? 'Status' : 'Status'}: {character.status}
                    </p>
                    <p className="card-text">
                      {language === 'en' ? 'Species' : 'Spezies'}: {character.species}
                    </p>
                    <p className="card-text">
                      {language === 'en' ? 'Gender' : 'Geschlecht'}: {character.gender}
                    </p>
                    <p className="card-text">
                      {language === 'en' ? 'Origin' : 'Herkunft'}: {character.origin.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default CharacterList;
