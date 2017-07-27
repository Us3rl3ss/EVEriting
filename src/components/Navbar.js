import React, { Component } from 'react';
import HaulingCalculator from '../components/HaulingCalculator';

class Navbar extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <div className="navbar-layout">
        <div>
          <HaulingCalculator
            selectedRowDataMarketOrders={this.props.selectedRowDataMarketOrders}
            marketOrdersRegionItem={this.props.marketOrdersRegionItem}
          />
        </div>
      </div>
    );
  }
}

export default Navbar;
