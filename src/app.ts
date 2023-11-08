import express, {Express} from "express";
import cors from "cors";
import morgan from "morgan";
import { DataSource } from "typeorm";

import { serverConfig } from "./config/server.config";
import { dataConfig } from "./config/data.config";
import { AccountRoute } from "./routes/account.route";
import * as process from "process";

export class App {
    dataSource: DataSource;
    server: Express;

    constructor() {
        // TODO: add routes
        const accountRoute = new AccountRoute();

        this.dataSource = new DataSource(dataConfig);

        this.server = express();
        this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
        this.server.use(
            "/api",
            express.json(),
            express.urlencoded({extended: true}),
            morgan("combined"),
            accountRoute.getRoute()
            // TODO: add routes
        )
    }

    run() {
        // TODO: initialize database
        this.dataSource.initialize().then(() => {
            this.server.listen(serverConfig.Port, () => {
                console.log(
                    `Server is running at http://localhost:${serverConfig.Port}`
                )
            })
        }). catch((error) => {
            console.log(error);
        })
    }
}