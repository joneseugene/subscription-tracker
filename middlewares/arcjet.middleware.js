import aj from '../config/arcjet.js'

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req)

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({ message: 'too many requests detected'})
            }
            if(decision.reason.isBot()){
                return res.status(403).json({ message: 'bot detected'})
            }
            return res.status(403).json({ message: 'access denied'})
        }
        next()
    } catch (error) {
        console.error(`Arcjet Middleware error: ${error}`)
        next(error)
    }
}

export default arcjetMiddleware;