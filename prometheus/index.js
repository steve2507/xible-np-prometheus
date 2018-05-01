'use strict';

module.exports = (NODE) => {
  const Prometheus = require('prometheus-server-wrapper').Prometheus;
  let prometheus;

  NODE.on('init', (state) => {
    prometheus = new Prometheus({ url: NODE.data.url });
  });

  const promOut = NODE.getOutputByName('prometheus');
  promOut.on('trigger', (conn, state, callback) => {
    callback(prometheus);
  });

  const alertManagersOut = NODE.getOutputByName('alertmanagers');
  alertManagersOut.on('trigger', async (conn, state, callback) => {
    callback(await prometheus.getActiveAlertManagers());
  });
};
