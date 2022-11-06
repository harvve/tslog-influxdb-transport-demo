import { randomInt } from 'crypto';
import { Logger, TLogLevelName } from 'tslog';
import { Transporter } from '@harvve/tslog-influxdb-transport';
import { faker } from '@faker-js/faker';

function log(logger: Logger) {
  const loglevels: Array<TLogLevelName> = ['silly', 'trace', 'debug', 'info', 'warn', 'error', 'fatal'];
  const level: TLogLevelName = loglevels[randomInt(8)];
  switch (level) {
    case 'silly':
      logger.silly(faker.hacker.phrase());
      break;
    case 'trace':
      logger.trace(faker.hacker.phrase());
      break;
    case 'debug':
      logger.debug(faker.hacker.phrase());
      break;
    case 'info':
      logger.info(faker.hacker.phrase());
      break;
    case 'warn':
      logger.warn(faker.hacker.phrase());
      break;
    case 'error':
      try {
        throw new Error(faker.hacker.phrase())
      } catch (err) {
        logger.error('Error occurred: ', err);
      }
      break;
    case 'fatal':
      try {
        throw new Error(faker.hacker.phrase())
      } catch (err) {
        logger.fatal('Fatal error occurred: ', err);
      }
      break;
    default:
      break;
  } 
}

async function main(): Promise<void> {
  const transport = new Transporter({
    address: process.env.ADDRESS as string || 'localhost',
    port: Number(process.env.PORT) as number || 3123,
    socketType: 'udp4',
    measurementName: process.env.MEASUREMENT_NAME as string,
    minLevel: 'silly'
  });
  const logger = new Logger({ type: 'json', minLevel: 'silly' ,attachedTransports: [transport.getTransportProvider()] });
  const interval = setInterval(log.bind(null, logger), 500);

  ['SIGINT', 'SIGHUP', 'SIGTERM'].forEach((event) => {
    process.on(event, () => {
      clearInterval(interval);
      process.exit(1);
    });
  })
}

main().catch(err => {
  throw err;
});
