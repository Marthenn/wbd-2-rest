const generatePort = () => {
    return process.env.PORT ? +process.env.PORT : 3000;
}

export const serverConfig: {Port: number} = {
    Port: generatePort()
}