import React from 'react';
import TableBody from '../components/TableBody';
import TableHead from '../components/TableHead';
import { Table, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

const TableElem = function({
  data,
  componentType,
  handleMarketOrdersRegion,
  handleMarketOrdersItem,
  regionInformation,
  typeInformation,
  stationInformation,
  systemInformation,
  selectedRowDataMarketOrders,
  toggleClassSelected
}) {
  let exceptions = {
    marketHistoryRegionItem: {
      dataOrder: [
        'date',
        'average',
        'highest',
        'lowest',
        'order_count',
        'volume'
      ]
    },
    marketOrdersRegionItem: {
      dataOrder: ['is_buy_order', 'volume_remain', 'price', 'location_id']
    }
  };

  function regionOptions() {
    if (regionInformation) {
      return regionInformation.map((ri, i) =>
        <option key={i} value={ri.region_id}>
          {ri.name}
        </option>
      );
    }
  }

  function typeOptions() {
    if (typeInformation) {
      return typeInformation.map((ti, i) =>
        <option key={i} value={ti.type_id}>
          {ti.name}
        </option>
      );
    }
  }

  return (
    <div className="col-sm-6">
      <div className="row">
        <FormGroup controlId="formControlsSelect" className="col-sm-6">
          <ControlLabel>Region</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="select"
            onChange={e => handleMarketOrdersRegion(e.target.value)}
          >
            {regionOptions()}
          </FormControl>
        </FormGroup>

        <FormGroup controlId="formControlsSelect" className="col-sm-6">
          <ControlLabel>Item</ControlLabel>
          <FormControl
            componentClass="select"
            placeholder="select"
            onChange={e => handleMarketOrdersItem(e.target.value)}
          >
            {typeOptions()}
          </FormControl>
        </FormGroup>
      </div>

      <Table striped condensed hover responsive>
        <TableHead
          data={data[0]}
          dataOrder={exceptions[componentType].dataOrder}
        />
        <TableBody
          data={data}
          dataOrder={exceptions[componentType].dataOrder}
          componentType={componentType}
          stationInformation={stationInformation}
          systemInformation={systemInformation}
          selectedRowDataMarketOrders={selectedRowDataMarketOrders}
          toggleClassSelected={toggleClassSelected}
        />
      </Table>
    </div>
  );
};

export default TableElem;
