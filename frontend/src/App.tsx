import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './App.css';
import {handleSearch} from './components/search.tsx';
import {Comment} from "./search/types.ts"

function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCommentUrl, setSelectedCommentUrl] = useState('');
    const dispatch = useDispatch();
    const searchResults = useSelector((state: any) => state.search.searchResults);

    const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const handleSearchClick = () => {
        handleSearch(searchQuery, dispatch);
    };

    const handleCommentClick = (url: string) => {
        setSelectedCommentUrl(url);
    };

    return (
        <div className="container">
            <div className="left-column">
                <input type="text" value={searchQuery} onChange={handleSearchQueryChange} placeholder="Search query"/>
                <button onClick={handleSearchClick}>Search</button>
                <div className="search-results">
                    {searchResults.map((comment: Comment) => (
                        <div key={comment.id} onClick={() => handleCommentClick(comment.url)}>
                            <h3>{comment.author}</h3>
                            <p>{comment.body}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="right-column">
                {selectedCommentUrl && <iframe src={selectedCommentUrl} style={{width: '100%', height: '100%'}}/>}
            </div>
        </div>
    );
}

export default App;
