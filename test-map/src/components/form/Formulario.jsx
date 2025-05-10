import React from 'react';

const Formulario = ({
  inputValueA,
  inputValueB,
  suggestions,
  onInputChangeA,
  onInputChangeB,
  onSelectSuggestion
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1,
      width: '300px',
      backgroundColor: 'white'
    }}>
      <input
        type="text"
        placeholder="Origen..."
        value={inputValueA}
        onChange={onInputChangeA}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Destino..."
        value={inputValueB}
        onChange={onInputChangeB}
        style={{ ...inputStyle, marginTop: '10px' }}
      />
      {suggestions.length > 0 && (
        <ul style={suggestionsStyle}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => onSelectSuggestion(suggestion.place_id, suggestion.description)}
              style={suggestionItemStyle}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '0 12px',
  borderRadius: '3px',
  border: '1px solid #ccc',
  fontSize: '14px',
  outline: 'none'
};

const suggestionsStyle = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  border: '1px solid #ccc',
  borderTop: 'none',
  maxHeight: '200px',
  overflowY: 'auto'
};

const suggestionItemStyle = {
  padding: '10px',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  color: 'black'
};

export default Formulario;
