module.exports = {
  apps: [
    {
      name: "euginestore-web",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "280M",
      env: {
        PORT: 3005,
        NODE_ENV: "production",
      },
    },
  ],
};
