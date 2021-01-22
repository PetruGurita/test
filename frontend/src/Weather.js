import React, { Component } from 'react'
import axios from "axios"

export default class Weather extends Component {
    constructor() {
        super();
        this.state = {
            weather: null
        };
    }

    componentDidMount = () => {
        axios.get("/getWeatherData")
        .then(function(response) {
            if (response.data !== null)
                console.log(response.data.weather);
            if (response.error !== null)
                console.log(response.data.error);
            console.log(response)
        })
        .catch(function(error) {
            console.log('Could not connect to backend');
        });
    };

    render() {
        return (
            <div>
                <h1> Weather is: {this.state.weather}</h1>
            </div>
        )
    }
}