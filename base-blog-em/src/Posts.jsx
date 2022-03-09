import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { PostDetail } from './PostDetail';

const MAX_POST_PAGE = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`);
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentPage < MAX_POST_PAGE) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(['posts', nextPage], () => fetchPosts(nextPage), {
        staleTime: 2000,
        keepPreviousData: true,
      });
    }
  }, [currentPage, queryClient]);

  const { isLoading, isError, error, data } = useQuery(['posts', currentPage], () => fetchPosts(currentPage));

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Something Wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  return (
    <>
      <ul>
        {data.map((post) => (
          <li key={post.id} className='post-title' onClick={() => setSelectedPost(post)}>
            {post.title}
          </li>
        ))}
      </ul>
      <div className='pages'>
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1);
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage >= MAX_POST_PAGE}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
