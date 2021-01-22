import logo from './logo.svg';
import './App.css';
import Test from "./Test";
// import Weather from "./Weather";
import Search from "./Search";
import Map from "./Map";
import CovidMap from "./CovidMap"
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './Navbar'
import ReactDOM from "react-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar/>
            <Route path='/' exact component={Search}/>
            <Route path='/weatherMap' component={Map}/>
            <Route path='/covidMap' component={CovidMap}/>
      </Router>  
    </>
  );
}

export default App;
//npm forever restarts all processes again