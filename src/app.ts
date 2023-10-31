import express, {Express} from "express";
import cors from "cors";
import morgan from "morgan";

export class App {
    server: Express;

    constructor() {
        // TODO: add routes

        this.server = express();
        this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
        this.server.use(
            "/api",
            express.json(),
            express.urlencoded({extended: true}),
            morgan("combined"),
            // TODO: add routes
        )
    }

    run() {
        // TODO: initialize database
    }
}