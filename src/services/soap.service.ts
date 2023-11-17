import { soapConfig } from "../config/soap.config";
import { UploadMiddleware } from "../middlewares/upload.middleware";
import axios from "axios";
import xml2js from "xml2js";
import {Account} from "../models/account.model";

export class SoapService {
    async createRequest(username: string, email: string, directory: string) {
        try {
            // create request
            const response = await axios.post<string>(
                `http://${soapConfig.host}:${soapConfig.port}/api/Service`,
                `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <CreateRequest xmlns="http://service.webwbd/">
                                <username xmlns="">${username}</username>
                                <email xmlns="">${email}</email>
                                <proof_directory xmlns="">${directory}</proof_directory>
                                <api_key xmlns="">${soapConfig.key}</api_key>
                            </CreateRequest>
                        </Body>
                    </Envelope>`,
                {
                    headers: {
                        "Content-Type": "text/xml"
                    }
                }
            )

            const xml = await xml2js.parseStringPromise(response.data);
            return(xml['S:Envelope']['S:Body'][0]['ns2:CreateRequestResponse'][0].return[0])
            // TODO: handle response from soap
        } catch (error) {
            // TODO: handle error
            return {
                status: false,
                message: error.message
            };
        }
    }

    async getRequest(username: string) {
        try {
            // create request
            // console.log(`http://${soapConfig.host}:${soapConfig.port}/api/Service`);
            // console.log(
            // `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
            //     <Body>
            //         <GetRequest xmlns="http://service.webwbd/">
            //             <username xmlns="">${username}</username>
            //             <api_key xmlns="">${soapConfig.key}</api_key>
            //         </GetRequest>
            //     </Body>
            // </Envelope>`
            // );
            const response = await axios.post<string>(
                `http://${soapConfig.host}:${soapConfig.port}/api/Service`,
                `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                    <Body>
                        <GetRequest xmlns="http://service.webwbd/">
                            <username xmlns="">${username}</username>
                            <api_key xmlns="">${soapConfig.key}</api_key>
                        </GetRequest>
                    </Body>
                </Envelope>`,
                {
                    headers: {
                        "Content-Type": "text/xml"
                    }
                }
            )
            // console.log("OSIDJFOIDSJFOI")

            const xml = await xml2js.parseStringPromise(response.data);
            // TODO: handle response from soap
            return xml['S:Envelope']['S:Body'][0]['ns2:GetRequestResponse'][0].return[0];            

        } catch (error) {
            // TODO: handle error
            return {
                status: false,
                message: error.message
            };
        }
    }

    async getRequestPage(page: number) {
        try {
            // create request
            const response = await axios.post<string>(
                `http://${soapConfig.host}:${soapConfig.port}/api/Service`,
                `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <GetRequestPage xmlns="http://service.webwbd/">
                                <page xmlns="">${page}</page>
                                <api_key xmlns="">${soapConfig.key}</api_key>
                            </GetRequestPage>
                        </Body>
                    </Envelope>`,
                {
                    headers: {
                        "Content-Type": "text/xml"
                    }
                }
            )

            const xml = await xml2js.parseStringPromise(response.data);

            // TODO: handle response from soap
            return xml['soap:Envelope']['soap:Body'][0]['ns2:getRequestPageResponse'][0].return[0];
        } catch (error) {
            // TODO: handle error
            return {
                status: false,
                message: error.message
            };
        }
    }

    async synchronizeAccounts(Accounts: Account[]) {
        try {
            /*
            * Make every account in Accounts to be in this xml format
            * <accounts>
            *        <id>[int]</id>
            *        <username>[string?]</username>
            *        <password>[string?]</password>
            *        <email>[string?]</email>
            *        <joinedDate>[dateTime?]</joinedDate>
            *        <expiredDate>[dateTime?]</expiredDate>
            *        <isAdmin>[boolean]</isAdmin>
            * </accounts>
            * */
            let accountsXML = '';
            Accounts.forEach((account) => {
                accountsXML += `<accounts>
                                    <id>${account.uid}</id>
                                    <username>${account.username}</username>
                                    <password>${account.password}</password>
                                    <email>${account.email}</email>
                                    <joinedDate>${account.joinedDate}</joinedDate>
                                    <isAdmin>${account.isAdmin}</isAdmin>`

                if (account.expiredDate) {
                    accountsXML += `<expiredDate>${account.expiredDate}</expiredDate>`
                }

                accountsXML += `</accounts>`
            });

            // create request
            const response = await axios.post<string>(
                `http://${soapConfig.host}:${soapConfig.port}/api/Service`,
                `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <SynchronizeAccounts xmlns="http://service.webwbd/">
                                <accounts xmlns="">${accountsXML}</accounts>
                                <api_key xmlns="">${soapConfig.key}</api_key>
                            </SynchronizeAccounts>
                        </Body>
                    </Envelope>`,
                {
                    headers: {
                        "Content-Type": "text/xml"
                    }
                }
            )

            const xml = await xml2js.parseStringPromise(response.data);
            // TODO: handle response from soap
            return xml['soap:Envelope']['soap:Body'][0]['ns2:synchronizeAccountsResponse'][0].return[0];
        } catch (error) {
            // TODO: handle error
            return {
                status: false,
                message: error.message
            };
        }
    }

    async approveRequest(username: string){
        try {
            // create request
            const response = await axios.post<string>(
                `http://${soapConfig.host}:${soapConfig.port}/api/Service`,
                `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <ApproveRequest xmlns="http://service.webwbd/">
                                <username xmlns="">${username}</username>
                                <api_key xmlns="">${soapConfig.key}</api_key>
                            </ApproveRequest>
                        </Body>
                    </Envelope>`
            )

            const xml = await xml2js.parseStringPromise(response.data);

            // TODO: handle response from soap
            return xml['S:Envelope']['S:Body'][0]['ns2:approveRequestResponse'][0].return[0];
        } catch (error) {
            // TODO: handle error
            return {
                status: false,
                message: error.message
            };
        }
    }

    async rejectRequest(username: string){
        try {
            // create request
            const response = await axios.post<string>(
                `http://${soapConfig.host}:${soapConfig.port}/api/Service`,
                `<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
                        <Body>
                            <RejectRequest xmlns="http://service.webwbd/">
                                <username xmlns="">${username}</username>
                                <api_key xmlns="">${soapConfig.key}</api_key>
                            </RejectRequest>
                        </Body>
                    </Envelope>`
            )

            const xml = await xml2js.parseStringPromise(response.data);

            // TODO: handle response from soap
            return xml['S:Envelope']['S:Body'][0]['ns2:RejectRequestResponse'][0].return[0];
        } catch (error) {
            // TODO: handle error
            return {
                status: false,
                message: error.message
            };
        }
    }
}
