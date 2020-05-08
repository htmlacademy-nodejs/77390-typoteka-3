'use strict';

require(`../../../utils/env`);

const colors = require(`colors/safe`);
const {log} = require(`../../../utils/log`);
const {app} = require(`./server`);

const DEFAULT_PORT = process.env.PORT_SERVICE_SERVER;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return log(`Ошибка при создании сервера: ${err}`, {status: `error`});
      }

      return console.info(colors.green(`Ожидаю соединений на ${port}`));
    });
  }
};
