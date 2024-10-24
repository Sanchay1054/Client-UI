import {BrowserRouter, Route, Routes} from 'react-router-dom';
import RegisterClient from '../Screen/RegisterClient';
import LoginClient from '../Screen/LoginClient';
import ClientChat from '../Screen/ClientChat';
import {SessionProvider} from '../Session/ClientSession';
import {ChatContext} from '../Components/ClientChat/ChatContext';
import UpdateClient from '../Screen/UpdateClient';
import ViewClient from '../Screen/ViewClient';

const Routing = () => {
    return(
        <SessionProvider>
            <ChatContext>
                <BrowserRouter>
                <Routes>
                    <Route path="/registerclient" element={<RegisterClient/>}/>
                    <Route path="/loginclient" element={<LoginClient/>}/>
                    <Route path="/client" element={<ClientChat/>}/>
                    <Route path="/updateclient" element={<UpdateClient/>}/>
                    <Route path="/viewclient" element={<ViewClient/>}/>
                </Routes>
                </BrowserRouter>
            </ChatContext>
        </SessionProvider>
    )
}
export default Routing;