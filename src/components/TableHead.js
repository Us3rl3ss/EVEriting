import React from 'react';
import strings from '../helpers/strings';

const TableHead = function({ data, dataOrder }) {
  return (
    <thead>
      <tr>
        {data
          ? dataOrder.map((k, i) => {
              return (
                <th key={i}>
                  {strings.labels[k]}
                </th>
              );
            })
          : null}
      </tr>
    </thead>
  );
};

export default TableHead;
