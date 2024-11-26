import mongoose from 'mongoose'

export default async function connect() {
    mongoose.connection.on('connected', () => console.log('DB connected'))
    mongoose.connection.on('error', (error) => console.error('DB Error', error))

    // Verbinden
    await mongoose.connect(process.env.DB_URI);
}