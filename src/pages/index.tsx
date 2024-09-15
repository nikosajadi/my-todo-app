

import React from 'react';
import { TaskProvider } from '@/context/taskContext'; 
import LocalTaskComponent  from '@/components/localTaskComponent'


const IndexPage: React.FC = () => {
  return (
    

    <TaskProvider>  
      <LocalTaskComponent />
    </TaskProvider>
  
    
  );
};


export default IndexPage;
