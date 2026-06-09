import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { getPopularMovies, searchMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/Search';


const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;


const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 60px;
  animation: ${fadeInUp} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  direction: rtl;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 30px 0 10px 0;
  background: linear-gradient(135deg, #ffffff 30%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    margin: 20px 0 5px 0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(229, 9, 20, 0.1);
  border-top: 4px solid #ff0844;
  border-radius: 50%;
  animation: spin 0.8s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 30px;
  padding: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;

  .emoji {
    font-size: 5rem;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
  }

  h2 {
    font-size: 1.8rem;
    margin-bottom: 12px;
    color: #fff;
    font-weight: 700;
  }

  p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.95rem;
    margin-bottom: 25px;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
`;

const ResetButton = styled.button`
  background: linear-gradient(135deg, #ff0844, #ffb199);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(255, 8, 68, 0.2);
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(255, 8, 68, 0.4);
  }
`;

const ScrollTopButton = styled.button`
  position: fixed;
  bottom: 30px;
  left: 30px;
  background: rgba(229, 9, 20, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 99;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);

  &:hover {
    transform: translateY(-5px) scale(1.05);
    background: #e50914;
  }

  @media (max-width: 480px) {
    bottom: 20px;
    left: 20px;
    width: 45px;
    height: 45px;
  }
`;

const StatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 15px;

  .count {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.85rem;

    span.number {
      color: #ff0844;
      font-weight: 700;
      margin: 0 4px;
    }

    span.query {
      color: #ffb199;
      font-weight: 500;
      margin-right: 8px;
    }
  }
`;

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPopularMovies();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadPopularMovies = async () => {
    setLoading(true);
    const data = await getPopularMovies();
    setMovies(data);
    setLoading(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadPopularMovies();
      return;
    }
    setLoading(true);
    const results = await searchMovies(query);
    setMovies(results);
    setLoading(false);
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    loadPopularMovies();
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>✨ جاري التحميل...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <SearchBar
        onSearch={handleSearch}
        value={searchQuery}
        onChange={setSearchQuery}
        onHomeClick={handleResetSearch}
      />

      {movies.length === 0 ? (
        <EmptyState>
          <div className="emoji">🎬🔍</div>
          <h2>لم نجد ما تبحث عنه</h2>
          <p>حاول البحث بكلمات مختلفة أو تصفح الأفلام الرائجة</p>
          <ResetButton onClick={handleResetSearch}>العودة للأفلام الرائجة</ResetButton>
        </EmptyState>
      ) : (
        <>
          <SectionTitle>
            {searchQuery ? 'نتائج البحث' : 'الأفلام الرائجة'}
          </SectionTitle>

          <StatsBar>
            <div className="count">
              تم العثور على <span className="number">{movies.length}</span> أفلام
              {searchQuery && <span className="query">للبحث: "{searchQuery}"</span>}
            </div>
          </StatsBar>

          <MovieGrid>
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={handleMovieClick}
                delay={index * 0.04}
              />
            ))}
          </MovieGrid>

          <ScrollTopButton $show={showScrollTop} onClick={scrollToTop}>
            ↑
          </ScrollTopButton>
        </>
      )}
    </Container>
  );
};

export default HomePage;
