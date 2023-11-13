#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import * as fs from 'fs';

const app = new Command();
app.version('1.0.0').description('Fetch weather data about your city');
app
  .command('weather')
  .description('Starts an app')
  .alias('w')
  .option('-s <value>', 'City to fetch the weater data')
  .option('-t <value>', 'Token to fetch data')
  .action(async (name, cmd) => {
    let config = {
      city: name.s ?? 'Москва',
      token: name.t ?? '70beadced2930ae176ca18a3bc1bd67f',
    };
    fs.writeFile('./config.json', JSON.stringify(config), () => {});
    fs.readFile('./config.json', 'utf-8', async (err, data) => {
      const { city, token } = JSON.parse(data);
      let weatherData = {};
      await axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}`)
        .then((response) => {
          weatherData = response.data;
          console.log(`
          |-|  ██╗░░░░░░█████╗░██████╗░  ░█████╗░██╗░░░░░██╗
          |-|  ██║░░░░░██╔══██╗██╔══██╗  ██╔══██╗██║░░░░░██║
          |-|  ██║░░░░░███████║██║░░██║  ██║░░╚═╝██║░░░░░██║
          |-|  ██║░░░░░██╔══██║██║░░██║  ██║░░██╗██║░░░░░██║
          |-|  ███████╗██║░░██║██████╔╝  ╚█████╔╝███████╗██║
          |-|  ╚══════╝╚═╝░░╚═╝╚═════╝░  ░╚════╝░╚══════╝╚═╝ 
          |-|  |Location: ${weatherData.name}, ${weatherData.sys.country}
          |-|  |Temperature: ${Math.ceil(weatherData.main.temp - 273.15).toFixed(0)}°C
          |-|  |Feels like: ${Math.ceil(weatherData.main.feels_like - 273.15).toFixed(0)}°C
          |-|  |Clouds: ${weatherData.weather[0].description}
          `);
        })
        .catch((err) => console.log('City is not found, try another'));
    });
  });
app.parse(process.argv);
