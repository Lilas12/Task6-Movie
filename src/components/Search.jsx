import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 12px rgba(229, 9, 20, 0.4); }
  50% { box-shadow: 0 0 22px rgba(229, 9, 20, 0.7); }
`;

const SearchContainer = styled.div`
  padding: 30px 20px;
  text-align: center;
  background: linear-gradient(180deg, rgba(10, 10, 18, 0.95) 0%, rgba(15, 15, 26, 0.85) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  z-index: 100;
  direction: rtl; /* Arabisk layout */
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 15px 10px; /* Mindre padding på mobilen så det inte blir trångt */
    margin-bottom: 10px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 25px;
  animation: ${float} 4s ease-in-out infinite;
  cursor: pointer;
  user-select: none;

  span {
    font-size: 2.5rem;
    transition: transform 0.4s ease;

    &:hover {
      transform: rotate(15deg) scale(1.1);
    }

    @media (max-width: 768px) {
      font-size: 1.8rem; /* Mindre emoji på mobilen */
    }
  }

  h1 {
    font-size: 2.4rem;
    background: linear-gradient(135deg, #ffffff 40%, #ff0844 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 800;
    letter-spacing: -1px;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 1.6rem; /* Mindre text på mobilen så det inte bryts fult */
    }
  }
`;

const SearchForm = styled.form`
  max-width: 650px;
  width: 100%; /* Tar upp full bredd upp till max-width */
  margin: 0 auto;
  position: relative;
  transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1);

  &:hover {
    transform: scale(1.01);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box; /* VIKTIGT: Gör att padding inte trycker ut inputen utanför skärmen på mobilen */
  padding: 16px 25px 16px 65px; /* Fixat: Mycket utrymme till VÄNSTER för knappen */
  font-size: 16px;
  border: 2px solid ${props => props.$isFocused ? '#ff0844' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.03);
  color: white;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  font-family: inherit;
  text-align: right; /* Texten skrivs från höger */

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.07);
    box-shadow: 0 0 25px rgba(255, 8, 68, 0.25), inset 0 0 10px rgba(0,0,0,0.5);
  }

  @media (max-width: 768px) {
    padding: 12px 15px 12px 50px; /* Anpassad padding för mobila skärmar */
    font-size: 14px;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  left: 8px; /* Ligger kvar på vänster sida så texten (RTL) flyter ifrån den */
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #ff0844, #ffb199);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${pulseGlow} 2.5s infinite;

  &:hover {
    transform: translateY(-50%) scale(1.08) rotate(-10deg);
    background: linear-gradient(135deg, #ff0844, #ff0844);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 0.95rem;
    left: 6px;
  }
`;

const SearchStats = styled.div`
  margin-top: 15px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap; /* Gör att texten hoppar ner snyggt på små mobilskärmar */

  span.query-text {
    color: #ffb199;
    font-weight: 600;
  }
`;

const ClearButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #fff;
    background: #ff0844;
    border-color: #ff0844;
  }
`;

const SearchBar = ({ onSearch, value, onChange, onHomeClick }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange('');
    onSearch('');
  };

  return (
    <SearchContainer>
      <Logo onClick={onHomeClick}>
        <span>🎬</span>
        <h1>Movie World</h1>
      </Logo>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="ابحث عن فيلمك المفضل... (مثال: Inception)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          $isFocused={isFocused}
        />
        <SearchButton type="submit">🔍</SearchButton>
      </SearchForm>

      {value && (
        <SearchStats>
          <span>🔎 نتائج البحث عن:</span>
          <span className="query-text">"{value}"</span>
          <ClearButton onClick={handleClear}>✖ مسح</ClearButton>
        </SearchStats>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
