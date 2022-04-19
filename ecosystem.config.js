module.exports = {
  apps: [
    {
      name: 'junat',
      script: 'yarn && yarn start',
      instances: 2,
      exec_mode: "cluster"
    }
  ],
  deploy: {
    production: {
      user: 'ubuntu',
      host: ['ssh.junat.live'],
      ref: 'origin/main',
      repo: 'git@github.com:junat-live/junat.live.git',
      path: '/home/ubuntu/junat-pm2'
    }
  }
}
