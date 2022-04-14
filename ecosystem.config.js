module.exports = {
  apps: [
    {
      name: 'junat',
      script: 'yarn build && yarn start',
      cwd: './site'
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
