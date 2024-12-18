module.exports = {
  apps: [{
    script: 'index.js',
    name: 'apps',
    watch: true,
    ignore_watch: [
      ".git",
      ".md",
    ],
    autorestart: true,
    args: 'APPS',
    time: true,
    env: {
      "PORT": "3000",
      "JWT_SECRET": "course",
      "CONNECTIONSTRING": '10.20.10.248:1521/epms',
      "URLS": 'localhost',
      "REACT_APP_URLS": 'localhost',

    },
  }, {
    script: 'index.js',
    name: 'gcm',
    watch: true,
    ignore_watch: [
      ".git",
      ".md",
    ],
    autorestart: true,
    args: 'GCM',
    time: true,
    env: {
      "PORT": "3100",
      "JWT_SECRET": "course",
      "CONNECTIONSTRING": '10.20.10.248:1521/epms',
      "URLS": 'localhost',
      "REACT_APP_URLS": 'localhost',

    },
  }/* , {
    script: 'index.js',
    name: 'backend.ustp.bak',
    watch: true,
    ignore_watch: [
      ".git",
      ".md",
    ],
    time: true,
    env: {
      "PORT": "3500",
      "JWT_SECRET": "course",
      "CONNECTIONSTRING": '10.20.10.234:1521/epms',
      "URLS": '10.20.10.13',
      "REACT_APP_URLS": '10.20.10.13',
    },
  } */],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
