import { useEffect, useState } from "react";
import axios from "axios";
//Styles
import "./App.css";

const App = () =>
{
  const [ projects, setProjects ] = useState( [] );

  useEffect( () =>
  {
    axios.get( "http://localhost:5000/api/projects" )
      .then( res =>
      {
        console.log( res );
        setProjects( res.data );
      } );
  }, [] );

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        { projects.map( ( project: any ) => (
          <li key={ project.id }>{ project.title }</li>
        ) ) }
      </ul>
    </div>
  );
};

export default App;