import * as dotenv from 'dotenv';

dotenv.config({path: '.env'})

const generateHost = () => {
    return process.env.SOAP_BASE_HOST ? process.env.SOAP_BASE_HOST : "localhost";
}

const generatePort = () => {
    return process.env.SOAP_BASE_PORT ? process.env.SOAP_BASE_PORT : "50002";
}

export const soapConfig: { host: string, port: string, key: string } = {
    host: generateHost(),
    port: generatePort(),
    key: "soap"
}