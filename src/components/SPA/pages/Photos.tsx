import { useUser } from '@clerk/clerk-react';
import { useParams } from '@tanstack/react-router';
import PhotoSessionContent from '@/components/PhotoContent/PhotoSessionContent';

const Photos = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  
  // Get the sessionId from the route parameters
  const { sessionId } = useParams({ from: '/sessions/photos/$sessionId' });
  
  console.log('user-->>', user);
  console.log('sessionId-->>', sessionId);
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (user === null) {
    return <div>No User</div>;
  }
  
  const userData = {
    id: user.id
  };

  return <PhotoSessionContent user={userData} sessionId={sessionId} />;
};

export default Photos;