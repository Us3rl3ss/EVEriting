import React from 'react';

const TableBody = function({
  data,
  dataOrder,
  componentType,
  stationInformation,
  systemInformation,
  selectedRowDataMarketOrders
}) {
  const exceptions = {
    is_buy_order: {
      renderIfType: 'marketOrdersRegionItem',
      renderFunc: buyOrder => (buyOrder === true ? 'BUY' : 'SELL')
    },
    location_id: {
      renderIfType: 'marketOrdersRegionItem',
      renderFunc: locationId => {
        if (stationInformation && systemInformation) {
          if (
            stationInformation.filter(si => si.station_id === locationId)[0]
          ) {
            const stationName = stationInformation.filter(
              si => si.station_id === locationId
            )[0].name;

            const systemId = stationInformation.filter(
              si => si.station_id === locationId
            )[0].system_id;

            if (systemInformation.filter(si => si.system_id === systemId)[0]) {
              const securityStatus = systemInformation
                .filter(si => si.system_id === systemId)[0]
                .security_status.toFixed(1);
              let cssClass = 'color-green';

              if (securityStatus >= 0.3 && securityStatus <= 0.5) {
                cssClass = 'color-brown';
              } else if (securityStatus <= 0.2) {
                cssClass = 'color-red';
              }

              return (
                <div>
                  <span className={cssClass}>
                    {securityStatus}
                  </span>
                  {` ${stationName}`}
                </div>
              );
            }
          }
        }
      }
    }
  };
  return (
    <tbody>
      {data.map((row, i) => {
        return (
          <tr key={i} onClick={() => selectedRowDataMarketOrders(row)}>
            {dataOrder.map((column, i) => {
              if (
                exceptions[column] &&
                exceptions[column].renderIfType === componentType
              ) {
                if (componentType === 'marketOrdersRegionItem') {
                  return (
                    <td key={i}>
                      {exceptions[column].renderFunc(row[column])}
                    </td>
                  );
                } else {
                  return (
                    <td key={i}>
                      {row[column]}
                    </td>
                  );
                }
              } else {
                return (
                  <td key={i}>
                    {row[column]}
                  </td>
                );
              }
            })}
          </tr>
        );
      })}
    </tbody>
  );
};

export default TableBody;
