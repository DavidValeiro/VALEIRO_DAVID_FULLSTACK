import {strictMode} from 'assert';
strictMode(true);
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <strictMode>
            <App />
        </strictMode>
    </BrowserRouter>
);