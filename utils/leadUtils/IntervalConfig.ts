const cronTimeOptions = [
    { duration: '1 minute', cron: '*/1 * * * *' },
    { duration: '5 minutes', cron: '*/5 * * * *' },
    { duration: '15 minutes', cron: '*/15 * * * *' },
    { duration: '30 minutes', cron: '*/30 * * * *' },
    { duration: '1 hour', cron: '0 */1 * * *' },
    { duration: '6 hours', cron: '0 */6 * * *' },
    { duration: '1 day', cron: '0 0 */1 * *' },
    { duration: '1 week', cron: '0 0 * * 0' },
    { duration: '1 month', cron: '0 0 1 */1 *' },
  ];

  export {cronTimeOptions};