module.exports = {
  apps: [
    {
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      name: 'junat.live',
      interpreter: 'none',
      exec_mode: 'cluster',
      instances: 'max',
      cwd: './site'
    }
  ]
}
