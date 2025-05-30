import React from 'react';

const Formulario = ({ inputValue, suggestions, onInputChange, onSelectSuggestion }) => {
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
        placeholder="Buscar dirección..."
        style={{
          width: '100%',
          height: '40px',
          padding: '0 12px',
          borderRadius: '3px',
          border: '1px solid #ccc',
          fontSize: '14px',
          outline: 'none'
        }}
        value={inputValue}
        onChange={onInputChange}
      />
      {suggestions.length > 0 && (
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          border: '1px solid #ccc',
          borderTop: 'none',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => onSelectSuggestion(suggestion.place_id, suggestion.description)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                color: 'black'
              }}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Formulario;
