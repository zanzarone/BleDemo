import React, {useState} from 'react';

import HomeScreen from './pages/home/Home';

export default function App() {
  const [isFirstTimeRun, firstTimeRun] = useState(false);
  return <HomeScreen />;
}
