import React from 'react';
import logo from './logo.svg';

import './App.css';
var moment = require('moment')

const DegreeToggle = ({degreeType, updateForecastDegree}) => {
  return (
    <React.Fragment>
    <div className="form-check form-check-inline">
        <input
        className="form-check-input"
        type="radio"
        name="degree-type"
        id="celsius"
        value="celsius"
        checked={degreeType === "celsius"}
        onChange={updateForecastDegree}
        />
        <label className="form-check-label" for="celsius">Celsius</label>
      </div>
      <div className="form-check form-check-inline">
        <input
        className="form-check-input"
        type="radio"
        name="degree-type"
        id="farenheit"
        value="fahrenheit"
        checked={degreeType === "fahrenheit"}
        onChange={updateForecastDegree}
        />
        <label className="form-check-label" for="farenheit">Farenheit</label>
      </div>
    </React.Fragment>
  )
}

const DayCard = ({ reading, degreeType }) => {
  let newDate = new Date();
  const weekday = reading.dt * 1000
  newDate.setTime(weekday)

  const fahrenheit = Math.round(reading.main.temp)
  const celsius = Math.round((fahrenheit - 32) * 5/9)

  const imgURL = `owf owf-${reading.weather[0].id} owf-5x`

  return (
    <div className="col-sm-2">
      <div className="card">
        <h3 className="card-title">{moment(newDate).format('dddd')}</h3>
        <p className="text-muted">{moment(newDate).format('MMMM Do, h:mm a')}</p>
        <i className={imgURL}></i>
        <h2>{degreeType === "celsius" ? celsius + "°C" : fahrenheit + "°F"}</h2>
        <div className="card-body">
          <p className="card-text">{reading.weather[0].description}</p>
        </div>
      </div>
    </div>
  )
}

class WeekContainer extends React.Component {
  state = {
    fullData: [],
    dailyData: [],
    degreeType: "fahrenheit"
  }

  updateForecastDegree = event => {
    this.setState({
      degreeType: event.target.value
    }, () => console.log(this.state))
  }

  componentDidMount = () => {
    const apiKey = "f43d1cd4fe2170e4bca92d99f058b623"
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?zip=11209&units=imperial&APPID=${apiKey}`
  

    fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
      const dailyData = data.list.filter(data => data.dt_txt.includes("18:00:00"))
      this.setState({
        fullData: data.list,
        dailyData: dailyData
      }, () => console.log(this.state))
    })
    
    .catch(err=> console.log(err))

  }

  formatDayCards = () => {
    return this.state.dailyData.map((reading, index) => <DayCard reading={reading} key={index}  />)
  }

  render() {
    return (
      <div className="container">
      <h1 className="display-1 jumbotron">5-Day Forecast.</h1>
      <h5 className="display-5 text-muted">New York, US</h5>
        <div className="row justify-content-center">

          {this.formatDayCards()}

        </div>
      </div>
    );
  }
}

function App() {
  return (
    <WeekContainer  />
  );
}

export default App;
