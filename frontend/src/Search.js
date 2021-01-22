import React, { Component } from 'react'
import axios from "axios"
import NotFound from './NotFound';
import MapResult from './MapResult';
import background from './img/background.mp4'
import SearchCity from './SearchCity';
import './Search.css'

export default class Map extends Component {
    constructor() {
        super();
        this.state = {
            dbResponse: null,
            value: '',
            lastValue: ''
        };
    }

    handleInputChange = e => {
        this.setState(prevState => {
          
            let dbResponse = prevState.dbResponse;
            let value = e.target.value;
            let lastValue = prevState.lastValue;
            return { dbResponse, value, lastValue }; 
        });
    }

    handleSearchCity = e => {
        e.preventDefault();
        
        axios.get("http://localhost:9000/getWeatherData?county=" + this.state.value)
        .then((response) => {
            this.setState(prevState => {
                let dbResponse = response.data;
                let value = prevState.value;
                let lastValue = this.state.value;
                return { dbResponse, value, lastValue}; 
            })
        });
        
    }

    displayData(data) {
        if (data.length === 5) {
            let weatherCall = {
                city: this.state.lastValue,
                forecast: this.state.dbResponse
            }
            return(<MapResult weather={weatherCall} />)
        }
        else {
            return (<NotFound />)
        }
    }

    render() {
        return (
       
    <>
            <video autoPlay muted loop id="background-video">
                <source src={background} type="video/mp4" />
            </video>
        
            <SearchCity
                value={this.state.value}
                showResult={true}
                change={this.handleInputChange}
                submit={this.handleSearchCity}
            />
            <div id="centerResponse">
                {this.state.dbResponse ? this.displayData(this.state.dbResponse)  : null}
            </div>
    </> 
        )
    }
}