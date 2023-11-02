const generateCacheExpirationTime = () => {
    return process.env.CACHE_EXPIRATION_TIME ? +process.env.CACHE_EXPIRATION_TIME : 3600;
}

export const cacheConfig: {CacheExpirationTime: number} = {
    CacheExpirationTime: generateCacheExpirationTime()
}