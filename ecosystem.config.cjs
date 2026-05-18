module.exports = {
  apps: [{
    name: 'xj-studio',
    script: 'server/index.js',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 3003,
      JWT_SECRET: 'xj-studio-d27aa020592803278aa244db24c53257',
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    merge_logs: true,
  }],
};
