import './App.css';
import { useEffect, useState} from "react";
import RunInfo from "./RunInfo";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "./styles/theme"
import {getJson} from "./util/fileHelpers";
import {fetchRest} from "./util/fetchHelpers";
import * as _ from "lodash";
import CredentialsType from "./types/CredentialsType";
import RunType, {CategoryType, GroupType, ParticipantType, StartGroupType} from "./types/JsonTypes";
import * as React from "react";

function App() {
    const defaultRunInfo = {
        'naam': '',
        'run_id': '',
        'rundatum': '',
        'rundatumlaat': '',
        'versie': '',
    };

    // use credentialsType
    const [credentials, setCredentials] = useState<CredentialsType>({
        username: '',
        password: ''
    });
    const [run, setRun] = useState<RunType>(defaultRunInfo);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [groups, setGroups] = useState<GroupType[]>([]);
    const [participants, setParticipants] = useState<ParticipantType[]>([]);
    const [startGroups, setStartGroups] = useState<StartGroupType[]>([]);
    const [error, setError] = useState('');

    const getRun = () => {
        void fetchRest('run', setRun, credentials, setError);
    };

    const getCategories = () => {
        void fetchRest('categorie', setCategories, credentials, setError)
    }

    const getGroups = () => {
        void fetchRest('groep', setGroups, credentials, setError)
    }

    const getParticipants = () => {
        void fetchRest('deelnemers_per_wedstrijd', setParticipants, credentials, setError);
    }

    const getPing = async () => {
        return await fetchRest('ping', () => {/* do nothing */
        }, credentials, setError) as { error?: string};
    }

    const login = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCredentials({
            username: (event.currentTarget.elements.namedItem('username') as HTMLInputElement)?.value ,
            password: (event.currentTarget.elements.namedItem('password') as HTMLInputElement)?.value
        });
    };

    // check if password and username updated
    useEffect(() => {
        if (credentials.username && credentials.password) {
            //https://www.uvponline.nl/uvponlineConnector/api/ping
            void getPing().then((data) => {
                if (!data.error) {
                    getRun();
                    getCategories();
                    getGroups();
                    getParticipants();
                }
            });
        }
    }, [credentials]);

    const loginForm = () => {
        return (
            // form to set username and password
            <form onSubmit={login}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-control" id="username" placeholder="Username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password"/>
                </div>
                <button type={"submit"} className="btn btn-primary">Login</button>
            </form>
        )
    }

    // if data changed store it on local storage
    window.addEventListener("beforeunload", (e) => {
        const json = getJson(participants, credentials, categories, groups, run, startGroups)
        localStorage.setItem('data', json);
        delete e['returnValue'];
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="App">
                <header className="App-header">
                    {(credentials.username && credentials.password) && !error && (!_.isEqual(run, defaultRunInfo)) ?
                        <RunInfo run={run ?? defaultRunInfo}
                                 participants={participants}
                                 groups={groups}
                                 categories={categories}
                                 setCategories={setCategories}
                                 setParticipants={setParticipants}
                                 setGroups={setGroups}
                                 credentials={credentials}
                                 startGroups={startGroups}
                                 setStartGroups={setStartGroups}
                        />
                        : loginForm()
                    }
                    {error ? <div>{error}</div> : null}
                </header>
            </div>
        </ThemeProvider>
    );
}

export default App;
