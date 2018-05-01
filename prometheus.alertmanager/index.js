'use strict';

module.exports = (NODE) => {
  const AlertManager = require('prometheus-server-wrapper').AlertManager;
  let alertManager;

  NODE.on('init', (state) => {
    alertManager = new AlertManager({ url: NODE.data.url });
  });

  const alertManagerIn = NODE.getInputByName('alertmanager');

  const alertManagerOut = NODE.getOutputByName('alertmanager');
  alertManagerOut.on('trigger', (conn, state, callback) => {
    callback(alertManager);
  })

  const alertsOut = NODE.getOutputByName('alerts');
  alertsOut.on('trigger', async (conn, state, callback) => {
    callback(await alertManager.getAlerts());
  });
};
