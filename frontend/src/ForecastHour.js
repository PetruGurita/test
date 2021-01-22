import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import SmallLabel from './SmallLabel';
import Text from './Text';
import device from './responsive/Device';

const ForecastWrapper = styled.div`
  flex-shrink: 0;
  flex-basis: 90px;
  padding: 10px;
  margin: 0 auto;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  max-width: 600px;
  @media ${device.tablet} {
    flex-basis: 110px;
  }
  @media ${device.laptop} {
    flex-basis: 125px;
  }
  @media ${device.laptopL} {
    flex-basis: 140px;
  }
`;

const WeatherIcon = styled.img`
  display: block;
  height: 100px;
  width: 100px;
  margin: 0 auto;
`;

const ForecastHour = props => {
  const { dayName, temp_max, temp_min, month, day, hour, icon } = props;
  const iconUrl = `http://openweathermap.org/img/wn/${icon}@4x.png`;

  return (
    <ForecastWrapper>
      <Text align="center">
        {dayName}
      </Text>
      <Text align="center">{day} {month}</Text>
      <WeatherIcon src={iconUrl} />
      <SmallLabel align="center" weight="400">
        <pre style={{marginTop:0 + 'em', marginBottom:0 + 'em'}}>{temp_max}&#176;&#8593;   {temp_min}&#176;&#8595;</pre>
      </SmallLabel>
    </ForecastWrapper>
  );
};

ForecastHour.propTypes = {
  temp_max: PropTypes.number.isRequired,
  temp_min: PropTypes.number.isRequired,
  dayName: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  day: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default ForecastHour;
