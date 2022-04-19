module.exports = {
  apps: [
    {
      name: 'junat',
      script: 'yarn && yarn start'
    }
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['ssh.junat.live'],
      ref: 'origin/main',
      repo: 'git@github.com:jqpe/junat.live.git',
      path: '/home/ubuntu/junat-pm2'
    }
  }
}
