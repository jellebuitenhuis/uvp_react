import CredentialsType from "../types/CredentialsType";
import {Dispatch, SetStateAction} from "react";
import RunType, {CategoryType, GroupType, ParticipantType} from "../types/JsonTypes";
import ErrorType from "../types/ErrorType";

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://uvp-express.onrender.com';
const apiKey = 'ingDLMRuGe9UKHRNjs7cYckS2yul4lc6';

export const fetchRest = async (request: string,
                                setData: Dispatch<SetStateAction<RunType>> |
                                    Dispatch<SetStateAction<CategoryType[]>> |
                                    Dispatch<SetStateAction<GroupType[]>> |
                                    Dispatch<SetStateAction<ParticipantType[]>>,
                                credentials: CredentialsType,
                                setError: Dispatch<SetStateAction<string>>) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);

    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    return fetch(`${baseUrl}/${request}`, {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: formData,
    })
        .then(response => response.json())
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((data: any) => {
            if ((data as ErrorType).error) {
                setError((data as ErrorType).error);
            } else {
                setError('');
                if(request === 'run') {
                    // eslint-disable-next-line
                    setData(data[0]);
                }
                else {
                    // eslint-disable-next-line
                    setData(data);
                }
            }
            // eslint-disable-next-line
            return data;
        })
        .catch(error => {
            console.log(error)
            // eslint-disable-next-line
            setError(error.toString());
            // eslint-disable-next-line
            return error;
        });
};

export const publishStartList = (credentials: CredentialsType, startList: string) => {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", apiKey);
    myHeaders.append("Content-Type", "application/json");

    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("startList", startList);
    return fetch(`${baseUrl}/xmlrpc_server`, {
        mode: 'cors',
        method: 'POST',
        headers: myHeaders,
        body: startList,
    })
        .then(response => response.json())
        .then((data: PromiseLike<string> | string) => {
            return data;
        });
}
