'use strict';

module.exports = (NODE) => {
  const promIn = NODE.getInputByName('prometheus');

  const metricsOut = NODE.getOutputByName('metrics');
  metricsOut.on('trigger', async (conn, state, callback) => {
    const proms = await promIn.getValues(state);
    const metrics = await Promise.all(proms.map(async prom =>
      prom.query(NODE.data.query)
    ));
    callback([].concat(...metrics));
  });
};
