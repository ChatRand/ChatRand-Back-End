const {eventBus} = require('../utils/eventBus');

eventBus.on('user_regsistered', (user) => {
  console.log(user);
});

module.exports = {
  emailEvent: eventBus,
};
