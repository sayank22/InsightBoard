import Dashboard from './pages/Dashboard';
import 'flag-icons/css/flag-icons.min.css';
import { BrowserRouter } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
}

export default App;