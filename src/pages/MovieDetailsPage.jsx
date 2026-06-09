import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { getMovieDetails, getImageUrl } from '../services/api';


const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); color: #ffd700; }
`;


const DetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 60px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  direction: rtl;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 24px;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 25px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #ff0844;
    border-color: #ff0844;
    transform: translateX(6px);
    box-shadow: 0 10px 20px rgba(255, 8, 68, 0.3);
  }

  &:active {
    transform: translateX(2px) scale(0.98);
  }
`;

const BackdropContainer = styled.div`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 30px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  animation: ${slideUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

const BackdropImage = styled.img`
  width: 100%;
  height: 550px;
  object-fit: cover;
  filter: brightness(0.85);

  @media (max-width: 960px) {
    height: 400px;
  }
  @media (max-width: 600px) {
    height: 250px;
  }
`;

const BackdropOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  background: linear-gradient(to top, rgba(10, 10, 18, 1) 0%, rgba(10, 10, 18, 0.4) 60%, transparent 100%);
  padding: 60px 40px 40px;

  @media (max-width: 768px) {
    padding: 30px 20px 20px;
  }
`;

const MovieTitle = styled.h1`
  font-size: 3.2rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #fff;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.15rem;
  color: #ffb199;
  font-style: italic;
  font-weight: 500;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DetailsCard = styled.div`
  background: linear-gradient(135deg, rgba(22, 22, 38, 0.9), rgba(13, 13, 23, 0.95));
  backdrop-filter: blur(30px);
  border-radius: 24px;
  padding: 40px;
  margin-top: -30px;
  position: relative;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  animation: ${slideUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;

  @media (max-width: 768px) {
    padding: 24px;
    margin-top: -15px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const InfoItem = styled.div`
  background: rgba(10, 10, 18, 0.5);
  padding: 20px 15px;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  border: 1px solid rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #ff0844;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(20, 20, 35, 0.8);
    border-color: rgba(255, 8, 68, 0.2);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);

    &::after {
      transform: scaleX(1);
    }

    .icon-star {
      animation: ${pulse} 0.6s ease infinite;
    }
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
`;

const InfoLabel = styled.div`
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Overview = styled.div`
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    color: #ff0844;
    margin-bottom: 15px;
    font-size: 1.4rem;
    font-weight: 700;
  }

  p {
    line-height: 1.8;
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.8);
    text-align: justify;
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
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
`;

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    setLoading(true);
    const data = await getMovieDetails(id);
    setMovie(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>🎬 جاري تحميل تفاصيل الفيلم...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!movie) {
    return (
      <LoadingContainer>
        <LoadingText>❌ لم يتم العثور على الفيلم</LoadingText>
      </LoadingContainer>
    );
  }

  const languages = {
    en: '🇬🇧 الإنجليزية',
    ar: '🇸🇦 العربية',
    fr: '🇫🇷 الفرنسية',
    es: '🇪🇸 الإسبانية',
    de: '🇩🇪 الألمانية',
    it: '🇮🇹 الإيطالية',
    ja: '🇯🇵 اليابانية',
    ko: '🇰🇷 الكورية',
    ru: '🇷🇺 الروسية',
    zh: '🇨🇳 الصينية'
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'غير معروف';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}س ${mins}د` : `${mins} دقيقة`;
  };

  const formatRevenue = (revenue) => {
    if (!revenue || revenue === 0) return 'غير معروف';
    if (revenue >= 1e9) return `$${(revenue / 1e9).toFixed(1)} مليار`;
    if (revenue >= 1e6) return `$${(revenue / 1e6).toFixed(1)} مليون`;
    return `$${revenue.toLocaleString()}`;
  };

  return (
    <DetailsContainer>
      <BackButton onClick={() => navigate('/')}>
        → العودة إلى الرئيسية
      </BackButton>

      <BackdropContainer>
        <BackdropImage
          src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
          alt={movie.title}
        />
        <BackdropOverlay>
          <MovieTitle>{movie.title}</MovieTitle>
          {movie.tagline && <Tagline>"{movie.tagline}"</Tagline>}
        </BackdropOverlay>
      </BackdropContainer>

      <DetailsCard>
        <InfoGrid>
          <InfoItem>
            <InfoLabel><span className="icon-star">⭐</span> التقييم</InfoLabel>
            <InfoValue style={{ color: '#ffd700' }}>{movie.vote_average?.toFixed(1)} / 10</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>🗣️ اللغة الأصلية</InfoLabel>
            <InfoValue>{languages[movie.original_language] || movie.original_language}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>📅 تاريخ الإصدار</InfoLabel>
            <InfoValue>{movie.release_date || 'غير معروف'}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>🎬 عدد التقييمات</InfoLabel>
            <InfoValue>{movie.vote_count?.toLocaleString()}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>⏱️ مدة العرض</InfoLabel>
            <InfoValue>{formatRuntime(movie.runtime)}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>💰 الإيرادات</InfoLabel>
            <InfoValue style={{ color: '#4caf50' }}>{formatRevenue(movie.revenue)}</InfoValue>
          </InfoItem>
        </InfoGrid>

        <Overview>
          <h3>📖 قصة الفيلم</h3>
          <p>{movie.overview || "لا يوجد وصف متاح لهذا الفيلم حالياً."}</p>
        </Overview>
      </DetailsCard>
    </DetailsContainer>
  );
};

export default MovieDetailsPage;
