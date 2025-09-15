import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
const logRoute = (req: Request, res: Response, next: NextFunction) => {

	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		if(process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
			console.log(chalk.hex("#3886b7")(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`)); //eslint-disable-line no-console
		}
		if(res.statusCode !== 200 && res.statusCode !== 304 && (process.env.NODE_ENV !== "test" )) {
			console.error(chalk.hex("#FF7F50")(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`));
		}
		
		
	});
	next();
};

export { logRoute };