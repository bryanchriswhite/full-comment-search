import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

function useSearchResults() {
    const dispatch = useDispatch();

    const setSearchResults = useCallback((comments) => {
        dispatch({
            type: 'search/setSearchResults',
            payload: comments,
        });
    }, [dispatch]);

    return setSearchResults;
}

export {useSearchResults};
