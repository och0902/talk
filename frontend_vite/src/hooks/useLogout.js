import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const useLogout = () => {

	const [ loading, setLoading ] = useState(false);
	const { setAuthUser } = useAuthContext();

	const logout = async () => {

		setLoading(true);
		
		try {
			const response = await fetch('/api/auth/logout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			const result = await response.json();
			if (result.error) {
				throw new Error(result.error);
			}

			localStorage.removeItem('chat-user');
			setAuthUser(null);

		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};

export default useLogout;
