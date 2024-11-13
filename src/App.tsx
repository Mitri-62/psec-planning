services:
  - type: web
    name: psec-planning-api
    env: node
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: PORT
        value: 3000
      - key: CORS_ORIGIN
        sync: false
    healthCheckPath: /api/health
    autoDeploy: true
