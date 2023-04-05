import React, {useState} from 'react';

import HomeScreen from './Home.jsx';

export default function App() {
  const [isFirstTimeRun, firstTimeRun] = useState(false);

  return <HomeScreen />;
}
