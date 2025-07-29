// In Home component
import { useUser } from '@clerk/clerk-react';
import SessionContent from '@/components/SessionContent/SessionContent';

const Home = () => {
  const { isSignedIn, isLoaded, user } = useUser();

  
  console.log('user-->>', user);
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (user === null) {
    return <div>No User</div>;
  }
  const userData = {
    id: user.id
  };

  return <SessionContent user={userData} />;
};

export default Home;