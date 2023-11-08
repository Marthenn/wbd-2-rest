import { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config({path: '.env'})

const generateSecret = () => {
    return process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : Math.random().toString();
};

const generateExpiresIn = () => {
    return process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : '1h';
};

export const jwtConfig: { secret: Secret, expiresIn: string } = {
    secret: generateSecret(),
    expiresIn: generateExpiresIn()
};