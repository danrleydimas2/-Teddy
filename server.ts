
import app from './src/app.ts'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger-output.json' assert { type: "json" }
import dotenv from 'dotenv'
dotenv.config()
const PORT: string = process.env.PORT

app.use('/api-docs', swaggerUi.serve,swaggerUi.setup(swaggerDocument))


app.listen(PORT, () => `server running on port ${PORT}`)