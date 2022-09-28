import './App.css';
import {useEffect, useState} from "react";
import RunInfo from "./RunInfo";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {theme} from "./styles/theme";
import {getJson} from "./util/fileHelpers";
import {fetchRest} from "./util/fetchHelpers";

function App() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [run, setRun] = useState([{
        'naam': '',
        'run_id': '',
        'rundatum': '',
        'rundatumlaat': '',
        'versie': '',
    }]);
    const [categories, setCategories] = useState([]);
    const [groups, setGroups] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [startGroups, setStartGroups] = useState([]);
    const [error, setError] = useState('');
    const [ping, setPing] = useState();

    const pingRpc = () => {
        // const parseString = require('xml2js').parseString();

        // console.log(formData)


//     fetch(baseUrl + '/xmlrpc_server', {
//       method: 'POST',
//       headers: myHeaders,
//       mode: 'cors',
//       body: JSON.stringify(
//         `<?xml version="1.0"?>
// <methodCall>
//     <methodName>sbn_uitslagen_ping_ws</methodName>
//     <params>
//         <param>
//             <value><string>username</string></value>
//         </param>
//         <param>
//             <value><string>password</string></value>
//         </param>
//         <param>
//             <value><string>2022</string></value>
//         </param>
//     </params>
// </methodCall>`
//       )
//     })
//       .then(response => response.text())
//       .then(data => {
//         console.log(data);
//       })
//       .catch(error => console.error('Error:', error));
    };

    const getRun = () => {
        fetchRest('run', setRun, credentials, setError);
    };

    const getCategories = () => {
        fetchRest('categorie', setCategories, credentials, setError)
    }

    const getGroups = () => {
        fetchRest('groep', setGroups, credentials, setError)
    }

    const getParticipants = () => {
        fetchRest('deelnemers_per_wedstrijd', setParticipants, credentials, setError);
    }

    const getPing = async () => {
        return await fetchRest('ping', setPing, credentials, setError);
    }


    const login = async (event) => {
        event.preventDefault();
        setCredentials({
            username: event.target.elements.username.value,
            password: event.target.elements.password.value
        });
    };

    // check if password and username updated
    useEffect(() => {
        if (credentials.username && credentials.password) {
            //https://www.uvponline.nl/uvponlineConnector/api/ping
            getPing().then((data) => {
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
    // useEffect(() => {
    //     const json = getJson(participants, credentials, categories, groups, run, startGroups)
    //     localStorage.setItem('data', json);
    // }, [participants, credentials, categories, groups, run, startGroups]);

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
                    {!credentials.username || !credentials.password || error ?
                        loginForm() :
                        <RunInfo run={run}
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
                    }
                    {error ? <div>{error}</div> : null}
                </header>
            </div>
        </ThemeProvider>
    );
}

export default App;
