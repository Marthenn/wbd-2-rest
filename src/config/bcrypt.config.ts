import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env'})

const generateSaltRounds = () => {
    return process.env.SALT_ROUNDS ? +process.env.SALT_ROUNDS : 10;
}

export const bcryptConfig: {SaltRounds: number} = {
    SaltRounds: generateSaltRounds()
}