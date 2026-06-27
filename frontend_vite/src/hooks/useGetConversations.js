import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const useGetConversations = () => {

	const [ loading, setLoading ] = useState(false);
	const [ conversations, setConversations ] = useState([]);

	useEffect(() => {

		const getConversations = async () => {
			setLoading(true);
			try {
				const response = await fetch('/api/users');
				const result = await response.json();
				if (result.error) {
					throw new Error(result.error);
				}

				setConversations(result);

			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();

	}, []);

	return { loading, conversations };
};

export default useGetConversations;
