module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'docker',
  database: process.env.DB_NAME || 'entrevista_sip',
  define: {
    timestamps: true,
    underscored: true,
  },
};
