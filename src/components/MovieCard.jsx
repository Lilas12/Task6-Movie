import styled from 'styled-components';
import { getImageUrl } from '../services/api';


const breakpoints = {
  mobile: '480px',
  tablet: '768px'
};

const Card = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(15, 15, 26, 0.95));
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.04);

  opacity: 0;
  animation: fadeInUp 0.6s cubic-bezier(0.215, 0.610, 0.355, 1) forwards;
  animation-delay: ${props => props.$delay || 0}s;


  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
              box-shadow 0.4s ease,
              border-color 0.4s ease;


  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff0844, #ffb199, #ff0844);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
    z-index: 3;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(255, 8, 68, 0.4);
    box-shadow: 0 20px 35px rgba(255, 8, 68, 0.15),
                0 0 15px rgba(15, 15, 26, 0.7);

    &::before {
      transform: scaleX(1);
    }
  }

  &:active {
    transform: translateY(-2px) scale(0.99);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    border-radius: 16px;
    &:hover {
      transform: translateY(-4px) scale(1.01);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 380px;
  overflow: hidden;


  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(transparent, rgba(15, 15, 26, 0.9));
    z-index: 1;
  }

  @media (max-width: ${breakpoints.tablet}) {
    height: 320px;
  }
  @media (max-width: ${breakpoints.mobile}) {
    height: 260px;
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #16162a, #0b0b14);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;

  &::after {
    content: '🎬';
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
  }
`;

const Badge = styled.div`
  position: absolute;
  background: rgba(10, 10, 18, 0.75);
  backdrop-filter: blur(12px);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);

  @media (max-width: ${breakpoints.mobile}) {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
`;

const RatingBadge = styled(Badge)`
  top: 12px;
  right: 12px;
  color: #ffd700;
  border-color: rgba(255, 215, 0, 0.2);
`;

const YearBadge = styled(Badge)`
  top: 12px;
  left: 12px;
  color: #e0e0e0;
`;

const MovieInfo = styled.div`
  padding: 16px;
  background: rgba(15, 15, 26, 0.95);

  @media (max-width: ${breakpoints.mobile}) {
    padding: 12px;
  }
`;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  transition: color 0.3s ease;

  ${Card}:hover & {
    color: #ffb199;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.85rem;
  }
`;

const MovieCard = ({ movie, onClick, delay = 0 }) => {
  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date?.slice(0, 4);

  return (
    <Card onClick={() => onClick(movie)} $delay={delay}>
      <ImageContainer>
        {movie.poster_path ? (
          <Poster src={getImageUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
        ) : (
          <NoImage />
        )}

        {rating && rating > 0 && (
          <RatingBadge>
            <span>⭐</span> {rating}
          </RatingBadge>
        )}

        {year && (
          <YearBadge>
            <span>📅</span> {year}
          </YearBadge>
        )}
      </ImageContainer>

      <MovieInfo>
        <Title>{movie.title}</Title>
      </MovieInfo>
    </Card>
  );
};

export default MovieCard;
