module.exports = {
  apps: [
    {
      name: 'talk-backend',
      script: './backend/server.js',
      cwd: '/var/www/talk',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4510,
        CLIENT_ORIGIN: 'http://talk.ystory52.com,https://talk.ystory52.com',
      },
      error_file: './logs/pm2-backend-error.log',
      out_file: './logs/pm2-backend-out.log',
      time: true,
    },
  ],
};
