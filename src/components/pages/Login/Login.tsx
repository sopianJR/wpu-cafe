import styles from './Login.module.css';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { FormEvent } from 'react';
import { setLocalStorage } from '../../../utils/storage';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const handleLogin = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const payload = {
            email: form.email.value,
            password: form.password.value,

        };
        const result = await login(payload);
        setLocalStorage('auth', result.token);

        return navigate('/orders');
    };


    return <main className={styles.login}>
        <div className={styles.card}>
            <h1 className={styles.title}>Login</h1>
            <form className={styles.form} onSubmit={handleLogin}>
                <Input label="Email" type='email' name="email" id="email" placeholder="Insert Email" required />
                <Input label="Password" type='password' name="password" id="password" placeholder="Insert Password" required />
                <Button type="submit">Login</Button>
            </form>
        </div>
    </main>
};

export default Login;