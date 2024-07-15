import express from 'express'

import swaggerUi from 'swagger-ui-express';
import specs from './swaggerConfig.mjs';

import apiv1Router from './apiv1/main.mjs'

const app = express()

app.use(express.json());

app.use("/api/v1", apiv1Router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5002

app.listen(PORT, () => {
    console.log(`app listening on port ${PORT}`)
})