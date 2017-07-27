import React, { Component } from 'react';
import {
  Popover,
  OverlayTrigger,
  ControlLabel,
  Button,
  FormGroup,
  FormControl,
  ProgressBar
} from 'react-bootstrap';
import * as _ from 'lodash';
import formatMoney from '../helpers/formatMoney';

class HaulingCalculator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shipVolume: 33540
    };

    this.calculate = _.debounce(this.calculate, 500).bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.progressBarConfig = this.progressBarConfig.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedRowDataMarketOrders &&
      nextProps.marketOrdersRegionItem
    ) {
      this.setState(
        {
          marketOrdersRegionItem: nextProps.marketOrdersRegionItem,
          buyingPrice:
            nextProps.selectedRowDataMarketOrders.is_buy_order === false
              ? nextProps.selectedRowDataMarketOrders.price
              : this.state.buyingPrice,
          sellingPrice:
            nextProps.selectedRowDataMarketOrders.is_buy_order === true
              ? nextProps.selectedRowDataMarketOrders.price
              : this.state.sellingPrice,
          quantity: this.updateQuantity(nextProps),
          unitVolume: 1
        },
        () => this.calculate()
      );
    }
  }

  updateQuantity(nextProps) {
    if (nextProps.selectedRowDataMarketOrders.is_buy_order) {
      return nextProps.selectedRowDataMarketOrders.volume_remain >=
      this.state.shipVolume
        ? this.state.shipVolume
        : nextProps.selectedRowDataMarketOrders.volume_remain;
    } else {
      return this.state.quantity;
    }
  }

  calculate() {
    this.setState({
      outcome: this.state.buyingPrice * this.state.quantity,
      income: this.state.sellingPrice * this.state.quantity,
      profit:
        this.state.sellingPrice * this.state.quantity -
          this.state.buyingPrice * this.state.quantity >
        0
          ? this.state.sellingPrice * this.state.quantity -
            this.state.buyingPrice * this.state.quantity
          : 0,
      loss:
        this.state.sellingPrice * this.state.quantity -
          this.state.buyingPrice * this.state.quantity <
        0
          ? this.state.sellingPrice * this.state.quantity -
            this.state.buyingPrice * this.state.quantity
          : 0
    });
  }

  renderInput(inputTypes, inputType, inputValue) {
    this.setState({
      [`${inputType}`]: inputTypes.includes(inputType) ? inputValue : ''
    });
  }

  handleCalculator(inputType, inputValue) {
    const inputTypes = [
      'buyingPrice',
      'sellingPrice',
      'quantity',
      'unitVolume'
    ];
    this.renderInput(inputTypes, inputType, inputValue);
    this.calculate();
  }

  progressBarConfig() {
    if (this.state.profit > 0 || (!this.state.profit && !this.state.loss)) {
      return {
        label: (
          <label className="f-w-700">
            {`Your profit is `}
            <div className="f-s-1-5">
              {formatMoney(this.state.profit)}
            </div>
          </label>
        ),
        bsStyle: 'success',
        profitOrLoss: this.state.profit,
        gainInvestmentRatio: `1 : ${parseInt(
          this.state.outcome / this.state.profit
        )}`
      };
    }

    if (this.state.loss < 0) {
      return {
        label: (
          <label className="f-w-700">
            {`Your loss is `}
            <div className="f-s-1-5">
              {formatMoney(this.state.loss)}
            </div>
          </label>
        ),
        bsStyle: 'danger',
        profitOrLoss: Math.abs(this.state.loss),
        gainInvestmentRatio: `1 : ${parseInt(
          this.state.outcome / Math.abs(this.state.loss)
        )}`
      };
    }
  }

  showProgressBar() {
    if (this.state.outcome) {
      const progressBarConfig = this.progressBarConfig();
      return (
        <div className="form-group">
          {progressBarConfig.label}
          <ProgressBar className="m-b-0-5">
            <ProgressBar
              active
              bsStyle={progressBarConfig.bsStyle}
              now={progressBarConfig.profitOrLoss}
              max={this.state.outcome}
              key={1}
            />
            <ProgressBar
              bsStyle="warning"
              now={this.state.outcome - progressBarConfig.profitOrLoss}
              max={this.state.outcome}
              key={2}
            />
          </ProgressBar>
          <div>
            <small>
              {`Gain / investment ration `}
              <b>
                {progressBarConfig.gainInvestmentRatio}
              </b>
            </small>
          </div>
        </div>
      );
    } else {
      return (
        <label className="f-w-700 form-group">
          <div className="f-s-1-5">EVElator</div>
          Enter values or select from table to calculate profit
        </label>
      );
    }
  }

  render() {
    console.log('HaulingCalculator this.state', this.state);
    const popoverBottom = (
      <Popover id="popover-positioned-bottom">
        <form>
          {this.showProgressBar()}

          <FormGroup controlId="formValidationNull" validationState={null}>
            <ControlLabel>Buying price</ControlLabel>
            <FormControl
              type="number"
              value={this.state.buyingPrice || ''}
              onChange={e =>
                this.handleCalculator('buyingPrice', e.target.value)}
            />
          </FormGroup>

          <FormGroup controlId="formValidationNull" validationState={null}>
            <ControlLabel>Selling price</ControlLabel>
            <FormControl
              type="number"
              value={this.state.sellingPrice || ''}
              onChange={e =>
                this.handleCalculator('sellingPrice', e.target.value)}
            />
          </FormGroup>

          <FormGroup controlId="formValidationNull" validationState={null}>
            <ControlLabel>Quantity</ControlLabel>
            <FormControl
              type="number"
              value={this.state.quantity || ''}
              onChange={e => this.handleCalculator('quantity', e.target.value)}
            />
          </FormGroup>

          <FormGroup controlId="formValidationNull" validationState={null}>
            <ControlLabel>Unit volume</ControlLabel>
            <FormControl
              type="number"
              value={this.state.unitVolume || ''}
              onChange={e =>
                this.handleCalculator('unitVolume', e.target.value)}
            />
          </FormGroup>
        </form>
      </Popover>
    );
    return (
      <OverlayTrigger trigger="click" placement="right" overlay={popoverBottom}>
        <img src="../img/calculator.png" />
      </OverlayTrigger>
    );
  }
}

export default HaulingCalculator;
