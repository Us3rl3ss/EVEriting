import React, { Component } from 'react';
import './App.css';
import ApiHelpers from './helpers/ApiHelpers';
import TableElem from './components/TableElem';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import Navbar from './components/Navbar';

class App extends Component {
  constructor() {
    super();

    this.state = {
      regionIds: [
        10000067,
        10000033,
        10000064,
        10000037,
        10000043,
        10000052,
        10000068,
        10000032,
        10000016,
        10000002,
        10000020,
        10000030,
        10000042
      ],
      typeIds: [3687, 3713, 3647, 43, 3685],
      characterIds: [97257509],
      user: {},
      marketHistoryRegionItem: [],
      marketOrdersRegionItem: [],
      marketOrdersRegion: 10000067,
      marketOrdersItem: 3687
    };

    this.handleMarketOrdersRegion = this.handleMarketOrdersRegion.bind(this);
    this.handleMarketOrdersItem = this.handleMarketOrdersItem.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.updateRegionInformation = this.updateRegionInformation.bind(this);
    this.updateTypeInformation = this.updateTypeInformation.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updatePortraitAndCorpInformation = this.updatePortraitAndCorpInformation.bind(
      this
    );
    this.updateMarketOrdersRegionItems = this.updateMarketOrdersRegionItems.bind(
      this
    );
    this.updateStationInformation = this.updateStationInformation.bind(this);
    this.updateSystemInformation = this.updateSystemInformation.bind(this);
    this.updateAllMarketOrdersRegionItem = this.updateAllMarketOrdersRegionItem.bind(
      this
    );
    this.showHeader = this.showHeader.bind(this);
    this.selectedRowDataMarketOrders = this.selectedRowDataMarketOrders.bind(
      this
    );
  }

  fetchData() {
    const componentThis = this;

    ApiHelpers.fetchChar(
      this.state.characterIds[0],
      this.updateUser,
      this.updatePortraitAndCorpInformation
    );

    ApiHelpers.fetchMarketHistoryRegionItem(
      this.state.regionIds[0],
      this.state.typeIds[0],
      componentThis
    );

    ApiHelpers.fetchMarketOrdersRegionItem(
      this.state.marketOrdersRegion,
      this.state.marketOrdersItem,
      this.updateMarketOrdersRegionItems,
      this.updateStationInformation,
      this.updateSystemInformation
    );

    //ApiHelpers.fetchAllMarketOrdersRegionItem(
    //  this.state.regionIds,
    //  this.state.typeIds,
    //  this.updateAllMarketOrdersRegionItem
    //);

    ApiHelpers.fetchRegionInformation(
      this.state.regionIds,
      this.updateRegionInformation
    );

    ApiHelpers.fetchTypeInformation(
      this.state.typeIds,
      this.updateTypeInformation
    );
  }

  updateRegionInformation(data) {
    this.setState({
      regionInformation: data
    });
  }

  updateTypeInformation(data) {
    this.setState({
      typeInformation: data
    });
  }

  updateUser(data) {
    this.setState({
      user: data
    });
  }

  updatePortraitAndCorpInformation(data) {
    this.setState({
      user: Object.assign({}, this.state.user, {
        portrait: data.portrait,
        corporationName: data.corporationName
      })
    });
  }

  updateMarketOrdersRegionItems(data) {
    this.setState({
      marketOrdersRegionItem: data
    });
  }

  updateStationInformation(data) {
    this.setState({
      stationInformation: data
    });
  }

  updateSystemInformation(data) {
    this.setState({
      systemInformation: data
    });
  }

  updateAllMarketOrdersRegionItem(data) {
    this.setState({
      allMarketOrdersRegionItem: data
    });
  }

  componentDidMount() {
    this.fetchData();
  }

  handleMarketOrdersRegion(region) {
    this.setState(
      {
        marketOrdersRegion: region
      },
      () => this.fetchData()
    );
  }

  handleMarketOrdersItem(item) {
    this.setState(
      {
        marketOrdersItem: item
      },
      () => this.fetchData()
    );
  }

  selectedRowDataMarketOrders(rowData, index) {
    this.setState({
      selectedRowDataMarketOrders: rowData,
      toggleClassSelected: index
    });
  }

  showHeader() {
    if (
      this.state.user.name &&
      this.state.user.portrait &&
      this.state.user.corporationName
    ) {
      return (
        <div className="App-header m-b-1-5">
          <div className="portrait">
            <img src={this.state.user.portrait} />
          </div>
          <h2 className="m-b-0-5">
            Welcome, {this.state.user.name}
          </h2>

          <div className="opac-0-5 m-b-1">
            <div>
              {this.state.user.corporationName}
            </div>
            <div>
              {`Born on ${moment(this.state.user.birthday).format(
                'dddd, MMMM Do YYYY'
              )} at ${moment(this.state.user.birthday).format('HH:mm:ss')}`}
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    console.log('this.state', this.state);
    return (
      <div className="App">
        <Navbar
          selectedRowDataMarketOrders={this.state.selectedRowDataMarketOrders}
          marketOrdersRegionItem={this.state.marketOrdersRegionItem}
        />

        <div className="m-l-3 clearfix">
          {this.showHeader()}

          <TableElem
            data={this.state.marketHistoryRegionItem}
            componentType="marketHistoryRegionItem"
          />

          <TableElem
            data={this.state.marketOrdersRegionItem}
            componentType="marketOrdersRegionItem"
            handleMarketOrdersRegion={this.handleMarketOrdersRegion}
            handleMarketOrdersItem={this.handleMarketOrdersItem}
            regionInformation={this.state.regionInformation}
            typeInformation={this.state.typeInformation}
            stationInformation={this.state.stationInformation}
            systemInformation={this.state.systemInformation}
            selectedRowDataMarketOrders={this.selectedRowDataMarketOrders}
            toggleClassSelected={this.state.toggleClassSelected}
          />
        </div>

        <div className="fixedBg" />
      </div>
    );
  }
}

export default App;
