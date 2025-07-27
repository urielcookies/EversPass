// In Home component
import { useUser } from '@clerk/clerk-react';
import SessionContent from '@/components/SessionContent/SessionContent';

const Home = () => {
  const { isSignedIn, isLoaded, user } = useUser();

  
  console.log('user-->>', user);
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  // return <SessionContent user={user} />;
  return <div>SessionContent</div>;
};

export default Home;