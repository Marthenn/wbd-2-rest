import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { DataSource } from "typeorm";
import { serverConfig } from "./config/server.config";
import { dataConfig } from "./config/data.config";
import { AccountRoute } from "./routes/account.route";
import { BookRoute } from "./routes/book.route";

export class App {
    dataSource: DataSource;
    server: Express;

    constructor() {
        const accountRoute = new AccountRoute();
        const bookRoute = new BookRoute();

        this.dataSource = new DataSource(dataConfig);

        this.server = express();
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(morgan("combined"));
        this.server.use(cors()); // Use cors directly without invoking it as a function

        // Add routes
        this.server.use("/api", bookRoute.getRoute());
        this.server.use("/api", accountRoute.getRoute());
        console.log("Routes added");

        this.server.get("/test", (req, res) => {
            console.log("Handling /test request");
            res.send("Test Route");
        });

        // Error handling middleware
        this.server.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
            console.error(err.stack);
            res.status(500).send("Something went wrong!");
        });
    }

    async run() {
        try {
            await this.dataSource.initialize();
            this.server.listen(serverConfig.Port, () => {
                console.log(`Server is running at http://localhost:${serverConfig.Port}`);
            });
        } catch (error) {
            console.error("Failed to initialize the application:", error);
        }
    }
}

const app = new App();
app.run();
