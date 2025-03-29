import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import CharacterList from './CharacterList'; 

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Rick and Morty Characters</h1>
        <CharacterList /> 
      </div>
    </ApolloProvider>
  );
}

export default App;
