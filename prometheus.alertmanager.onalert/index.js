'use strict';

module.exports = (NODE) => {
  const alertManagersIn = NODE.getInputByName('alertmanagers');

  const triggerOut = NODE.getOutputByName('trigger');

  const alertOut = NODE.getOutputByName('alert');
  alertOut.on('trigger', (conn, state, callback) => {
    const thisState = state.get(NODE);
    if (!thisState) {
      return;
    }

    callback(thisState.alert);
  });

  NODE.on('init', async (state) => {
    const alertManagers = await alertManagersIn.getValues(state);
    let lastAlertStartAt = Date.now();

    setInterval(() => {
      alertManagers.forEach(async (alertManager) => {
        const newAlerts = (await alertManager.getAlerts())
        .filter(alert => alert.startsAt.getTime() > lastAlertStartAt);

        newAlerts.forEach((newAlert) => {
          const startsAt = newAlert.startsAt.getTime();
          if (startsAt > lastAlertStartAt) {
            lastAlertStartAt = startsAt;
          }

          const newAlertState = state.split();
          newAlertState.set(NODE, { alert: newAlert });
          triggerOut.trigger(newAlertState);
        });
      });
    }, 1000);
  });
};
