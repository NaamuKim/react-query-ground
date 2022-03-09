import InfiniteScroll from 'react-infinite-scroller';
import { useInfiniteQuery } from 'react-query';
import { Species } from './Species';

const initialUrl = 'https://swapi.dev/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const { data, isLoading, isError, error, hasNextPage, fetchNextPage } = useInfiniteQuery(
    'star-wars-species',
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isLoading) return <div className='loading'>Loading...</div>;
  if (isError) {
    return (
      <div>
        <h3>Something Wrong...</h3>
        <p>{error.toString()}</p>
      </div>
    );
  }

  return (
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data.pages.map((pageData) =>
        pageData.results.map((result) => (
          <Species
            key={result.name}
            name={result.name}
            language={result.language}
            averageLifespan={result.average_lifespan}
          />
        ))
      )}
    </InfiniteScroll>
  );
}
