import React, {Component} from 'react';
import axios from 'axios';
import autoBind from'auto-bind';

import './App.css';

class App extends Component {

    render() {
        return (
            <div className="App">
                <Search/>
            </div>
        );
    }
}

class Search extends React.Component {

    constructor() {
        super();
        this.state = {
            currentSearchString: "",
            countries: [],
            numResults: 0
        };
        autoBind(this);
    }

    search(e) {
        this.setState({
            currentSearchString: e.target.value
        }, () => {
            if (this.state.currentSearchString && this.state.currentSearchString.length > 1) {
                if (this.state.currentSearchString.length % 2 === 0) {
                    this.hitSearch();
                }
            } else {
                this.setState({
                    countries: [],
                    numResults: 0,
                    regions: [],
                    subregions: []
                })
            }
        })
    }

    hitSearch() {
        const url = '/countries/?searchTerm='+this.state.currentSearchString;
        axios.get(url).then(response => {
            if(Array.isArray(response.data)){
                this.setState({
                    countries: response.data,
                    numResults: response.data.length
                });
                this.countRegions();
            } else {
                this.setState({
                    countries: [],
                    numResults: 0,
                    regions: [],
                    subregions: []

                })
            }
            }
        );
    }

    countRegions(){
        let regions = new Map();
        let subregions = new Map();
        if(this.state.countries.length > 1){
            this.state.countries.map(function(element){
                if(regions.has(element.region)){
                    var currentCount = regions.get(element.region);
                    regions.set(element.region, currentCount+=1);
                }  else {
                    regions.set(element.region, 1);
                }
                if(subregions.has(element.subregion)){
                    var currentCount = subregions.get(element.subregion);
                    subregions.set(element.subregion, (currentCount+=1));
                }  else {
                    subregions.set(element.subregion, 1);
                }
            });
        }
        this.setState({'regions': regions, 'subregions': subregions});
    }

    render() {

        let citiesSection = this.state.countries.map(function (element) {
            return <CountryView key={element.name} country={element}/>
        });

        return (
            <div>
                Search for a country: <input onChange={this.search}/>
                <div>
                    {citiesSection}
                </div>
                <FooterView regions={this.state.regions} subregions={this.state.subregions} countries={this.state.countries} count={this.state.numResults}/>
            </div>

        );
    }
}

class FooterView extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    renderRegions(){
        if(this.props.regions){
            let regions = Array.from(this.props.regions);
            return  regions.map(function (element) {
                return <span key={element}> {element.join(': ') + " "} </span>
            })
        }
    }
    renderSubregions(){
        if(this.props.subregions){
            let subregions = Array.from(this.props.regions);
            return subregions.map(function (element) {
                return <span key={element}> {element.join(': ') + " "} </span>
            })
        }
    }

    render(){
        let regionSection = this.renderRegions();
        let subregionSection = this.renderSubregions();
        return(
            <div>
            <footer className="footer"> {this.props.count} Results <br/>
                Regions: {regionSection} <br/>
                Subregions: {subregionSection} <br/>
            </footer>

            </div>
        );
    }
}

class CountryView extends Component {

    renderImg(src){
        return(
            <img src={src} width="100" height="100" alt="No Flag available"/>
        );
    }

    render() {

        let country = this.props.country;
        let languages = country.languages.map(function (element) {
            return element.name + " ";
        });

        return (
            <div className="countryBox">
                Name: {country.name} <br/>
                Alpha 2 Code: {country.alpha2Code} <br/>
                Alpha 3 Code: {country.alpha3Code} <br/>
                Country: {country.region} <br/>
                Population: {country.population} <br/>
                Languages: {languages} <br/>
                {this.renderImg(country.flag)}
            </div>);
    }
}

export default App;
