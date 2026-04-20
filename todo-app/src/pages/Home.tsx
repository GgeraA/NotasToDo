// src/pages/Home.tsx
import HeroSection from '../components/Home/HeroSection';
import InfoSection from '../components/Home/InfoSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroSection />
      <InfoSection />
    </div>
  );
};

export default Home;