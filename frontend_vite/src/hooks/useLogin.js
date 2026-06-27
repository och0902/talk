import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext.jsx';

const useLogin = () => {

	const [ loading, setLoading ] = useState(false);
	const { setAuthUser } = useAuthContext();

	const login = async (username, password) => {
	
      const success = handleInputErrors(username, password);
		if (!success) return;
		setLoading(true);

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});

         const result = await response.json();
			if (result.error) {
				throw new Error(result.error);
			}

			localStorage.setItem('chat-user', JSON.stringify(result));
			setAuthUser(result);

		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};
	return { loading, login };
};

export default useLogin;


function handleInputErrors(username, password) {
	if (!username || !password) {
		toast.error('Please fill in all fields');
		return false;
	}
	return true;
}