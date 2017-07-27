import * as _ from 'lodash';

const ApiHelpers = {
  fetchRegionInformation: (regionIds, updateRegionInformation) => {
    const urls = regionIds.map(
      ri =>
        `https://esi.tech.ccp.is/latest/universe/regions/${ri}/?datasource=tranquility&language=en-us`
    );

    return Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
      .then(function(data) {
        return updateRegionInformation(data);
      })
      .catch(err => console.log('fetchRegionInformation', err));
  },
  fetchTypeInformation: (typeIds, updateTypeInformation) => {
    const urls = typeIds.map(
      ti =>
        `https://esi.tech.ccp.is/latest/universe/types/${ti}/?datasource=tranquility&language=en-us`
    );

    return Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
      .then(function(data) {
        return updateTypeInformation(data);
      })
      .catch(err => console.log('fetchTypeInformation', err));
  },
  fetchChar: (charId, updateUser, updatePortraitAndCorpInformation) =>
    fetch(
      `https://esi.tech.ccp.is/latest/characters/${charId}/?datasource=tranquility`
    )
      .then(response => response.json())
      .then(function(data) {
        updateUser(data);
        const corpId = data.corporation_id; // get a random country from the returned data
        const urls = [
          'https://esi.tech.ccp.is/latest/characters/97257509/portrait/?datasource=tranquility',
          `https://esi.tech.ccp.is/latest/corporations/names/?corporation_ids=${corpId}&datasource=tranquility`
        ];

        Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
          .then(function(data) {
            updatePortraitAndCorpInformation({
              portrait: data[0].px256x256,
              corporationName: data[1][0].corporation_name
            });
          })
          .catch(err => console.log('promiseAllFetchCharErr', err));
      })
      .catch(err => console.log('fetchCharErr', err)),
  fetchMarketHistoryRegionItem: (
    marketHistoryRegion,
    marketHistoryItem,
    componentThis
  ) =>
    fetch(
      `https://esi.tech.ccp.is/latest/markets/${marketHistoryRegion}/history/?datasource=tranquility&type_id=${marketHistoryItem}`
    )
      .then(res => res.json())
      .then(function(data) {
        componentThis.setState({
          marketHistoryRegionItem: _.orderBy(data, ['date'], ['desc'])
        });
      })
      .catch(err => console.log('fetchMarketHistoryRegionItemErr', err)),
  fetchMarketOrdersRegionItem: (
    marketOrdersRegion,
    marketOrdersItem,
    updateMarketOrdersRegionItems,
    updateStationInformation,
    updateSystemInformation
  ) =>
    fetch(
      `https://esi.tech.ccp.is/latest/markets/${marketOrdersRegion}/orders/?datasource=tranquility&order_type=all&page=1&type_id=${marketOrdersItem}`
    )
      .then(response => response.json())
      .then(function(data) {
        updateMarketOrdersRegionItems(data);

        const urls = data
          .map(d => d.location_id)
          .filter((d, i, arr) => arr.indexOf(d) === i)
          .map(
            d =>
              `https://esi.tech.ccp.is/latest/universe/stations/${d}/?datasource=tranquility`
          );

        Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
          .then(function(data) {
            updateStationInformation(data);

            const urls = data
              .map(d => d.system_id)
              .filter((d, i, arr) => arr.indexOf(d) === i)
              .map(
                d =>
                  `https://esi.tech.ccp.is/latest/universe/systems/${d}/?datasource=tranquility&language=en-us`
              );

            Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
              .then(function(data) {
                updateSystemInformation(data);
              })
              .catch(err => console.log('promiseAllFetchSystemId', err));
          })
          .catch(err =>
            console.log('promiseAllFetchMarketOrdersRegionItemErr', err)
          );
      })
      .catch(err => console.log('fetchMarketOrdersRegionItemErr', err)),
  fetchAllMarketOrdersRegionItem: (
    marketOrdersRegions,
    marketOrdersItems,
    updateAllMarketOrdersRegionItem
  ) => {
    const urls = [];
    marketOrdersRegions.map(or =>
      marketOrdersItems.map(oi =>
        urls.push(
          `https://esi.tech.ccp.is/latest/markets/${or}/orders/?datasource=tranquility&order_type=all&page=1&type_id=${oi}`
        )
      )
    );

    Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
      .then(function(data) {
        updateAllMarketOrdersRegionItem(data);
      })
      .catch(err => console.log('fetchAllMarketOrdersRegionItemErr', err));

    /*fetch(
      `https://esi.tech.ccp.is/latest/markets/${marketOrdersRegion}/orders/?datasource=tranquility&order_type=all&page=1&type_id=${marketOrdersItem}`
    )
      .then(response => response.json())
      .then(function(data) {
        updateMarketOrdersRegionItems(data);

        const urls = data
          .map(d => d.location_id)
          .filter((d, i, arr) => arr.indexOf(d) === i)
          .map(
            d =>
              `https://esi.tech.ccp.is/latest/universe/stations/${d}/?datasource=tranquility`
          );

        Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
          .then(function(data) {
            updateStationInformation(data);

            const urls = data
              .map(d => d.system_id)
              .filter((d, i, arr) => arr.indexOf(d) === i)
              .map(
                d =>
                  `https://esi.tech.ccp.is/latest/universe/systems/${d}/?datasource=tranquility&language=en-us`
              );

            Promise.all(urls.map(url => fetch(url).then(resp => resp.json())))
              .then(function(data) {
                updateSystemInformation(data);
              })
              .catch(err => console.log('promiseAllFetchSystemId', err));
          })
          .catch(err =>
            console.log('promiseAllFetchMarketOrdersRegionItemErr', err)
          );
      })
      .catch(err => console.log('fetchMarketOrdersRegionItemErr', err));*/
  }
};

export default ApiHelpers;
