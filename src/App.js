import Routes from './Routes';
import { AuthProvider } from './components/auth/AuthProvider';
import './styles/courses.css';
import './styles/blog.css';
import './styles/admin.css';

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
