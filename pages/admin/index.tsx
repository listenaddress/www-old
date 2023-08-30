import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '@/context/store';
import Button from '@/components/button';
import Dropdown from '@/components/dropdown';
import { Toaster, toast } from 'sonner'
import { extractSpotifyShowId } from '@/lib/helpers';

export default function Admin() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [taskShowing, setTaskShowing] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [podcastUrl, setPodcastUrl] = useState('');
  const [pinnedSpotifyPodcasts, setPinnedSpotifyPodcasts] = useState([]);
  const [pinnedItunesPodcasts, setPinnedItunesPodcasts] = useState([]);
  const [pinnedYoutubeChannels, setPinnedYoutubeChannels] = useState([]);
  const [pinnedRssFeeds, setPinnedRssFeeds] = useState([]);

  const [venue, setVenue] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const { user } = useContext(GlobalContext);
  const router = useRouter();

  const fetchPins = async () => {
    const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pins`, {
      headers: {
        'Authorization': `Bearer ${accessTokenFromCookie}`,
        'Content-Type': 'application/json'
      }
    })
    const resJson = await res.json()
    const spotifyPodcasts = resJson.filter((item: any) => item.type === 'spotify_podcast')
    const itunesPodcasts = resJson.filter((item: any) => item.type === 'itunes_podcast')
    const youtubeChannels = resJson.filter((item: any) => item.type === 'youtube_channel')
    const rssFeeds = resJson.filter((item: any) => item.type === 'rss_feed')
    setPinnedSpotifyPodcasts(spotifyPodcasts)
    setPinnedItunesPodcasts(itunesPodcasts)
    setPinnedYoutubeChannels(youtubeChannels)
    setPinnedRssFeeds(rssFeeds)
  }

  useEffect(() => {
    fetchPins()
  }, []);


  const handleSearchGoogleBooks = (e: any) => {
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/books?query=${search}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data.items.map((item: any) => ({
          title: `${item.volumeInfo.title}${item.volumeInfo.subtitle ? `: ` + item.volumeInfo.subtitle : ''}`,
          authors: item.volumeInfo.authors,
          description: item.volumeInfo.description,
          externalIds: item.volumeInfo.industryIdentifiers.map((id: any) => ({
            venue: id.type,
            ext_id: id.identifier,
          })),
          venue: item.volumeInfo.publisher,
          publishedDate: item.volumeInfo.publishedDate,
          url: item.volumeInfo.canonicalVolumeLink
        })));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleSaveBook = async (book: any) => {
    let bookVenue = book.venue;
    if (venue) bookVenue = venue;
    const data = {
      title: book.title,
      authors: book.authors.map((author: any) => ({ name: author })),
      description: book.description,
      external_ids: book.externalIds,
      venue: bookVenue,
      created_at: book.publishedDate,
      url: canonicalUrl ? canonicalUrl : book.url,
      type: 'book'
    };
    try {
      const res = fetch(`${process.env.NEXT_PUBLIC_API_URL}content/from_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      toast.success(`Saved ${book.title}`);
      setVenue('');
      setCanonicalUrl('');
    } catch (error) {
      toast.error('Error saving book');
    }
  }

  const handlePinPodcast = async () => {
    const podcastId = podcastUrl.includes('spotify.com') ? extractSpotifyShowId(podcastUrl) : podcastUrl;

    const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessTokenFromCookie}`
        },
        body: JSON.stringify({
          external_id: podcastId,
          type: 'spotify_podcast',
        }),
      });

      if (res.ok) {
        toast.success('Podcast pinned successfully');
        setPodcastUrl('');
      } else {
        toast.error('Error pinning podcast');
      }
    } catch (error) {
      toast.error('Error pinning podcast');
    }
  };

  const dropdownItems = [
    {
      text: 'Add book from Google Books',
      onClick: () => setTaskShowing('addBookFromGoogleBooks')
    },
    {
      text: 'Add book manually',
      onClick: () => setTaskShowing('addBookManually')
    },
    {
      text: 'Pin Spotify Podcast',
      onClick: () => setTaskShowing('pinSpotifyPodcast')
    },
    {
      text: 'Pin iTunes Podcast',
      onClick: () => setTaskShowing('pinItunesPodcast')
    },
    {
      text: 'Pin YouTube Channel',
      onClick: () => setTaskShowing('pinYoutubeChannel')
    },
    {
      text: 'Pin RSS Feed',
      onClick: () => setTaskShowing('pinRssFeed')
    },
    {
      text: 'Pin Semantic Scholar Author',
      onClick: () => setTaskShowing('pinSemanticScholarAuthor')
    }
  ];

  return (
    <div className='m-4 mb-28 sm:ml-20'>
      <Toaster />
      <div className={`text-lg`}>
        <div className={`items-center cursor-pointer inline-block mt-[3px]`}>
          <span className='font-medium'>Admin</span>
        </div>
        <div className={`ml-auto inline-block float-right relative`}>
          <Button
            size="sm"
            secondary
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Task
          </Button>
          {
            dropdownOpen && (
              <Dropdown
                left={'-14.5'}
                setIsOpen={() => setDropdownOpen}
                items={dropdownItems}
              />
            )
          }
        </div>
        <div className={`mt-6`}>
          {
            taskShowing === 'addBookFromGoogleBooks' && (
              <div>
                <div className={`text-lg font-medium`}>
                  Add book from Google Books
                </div>
                <div className={`mt-4`}>
                  <div className={`text-sm`}>
                    Search for a book on Google Books:
                  </div>
                  <div className={`mt-2`}>
                    <input
                      className={`border border-gray-300 rounded-md p-2 w-full`}
                      placeholder="Search for a book on Google Books"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <div className={`mt-2`}>
                    <Button
                      size="sm"
                      secondary
                      onClick={handleSearchGoogleBooks}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            )
          }
          {
            taskShowing === 'pinSpotifyPodcast' && (
              <div className={"mt-4"}>
                <input
                  className={"border border-gray-300 rounded-md p-2 w-full"}
                  placeholder="Spotify Podcast URL or ID"
                  value={podcastUrl}
                  onChange={e => setPodcastUrl(e.target.value)}
                />
                <div className={"mt-2"}>
                  <Button
                    size="sm"
                    secondary
                    onClick={handlePinPodcast}
                  >
                    Pin Spotify Podcast
                  </Button>
                </div>
                {pinnedSpotifyPodcasts.length}
                {
                  pinnedSpotifyPodcasts.map((podcast: any, index: number) => (
                    <div key={index} className={"mt-2"}>
                      <div className={"text-xs"}>
                        {index} - {podcast.external_id}
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
      </div>
      <div>
        {searchResults.map((book: any, index) => (
          <div key={index} className={`mt-4`}>
            <div className={`text-lg font-medium`}>
              {book.title}
            </div>
            <div className={`text-sm`}>
              {book.authors && book.authors.join(', ')}
            </div>
            <div className={`text-xs`}>
              {/* Italics */}
              <span className={`italic`}>{book.venue}</span>
              {!book.venue && (
                <div className={`mt-2`}>
                  <input
                    className={`border border-gray-300 rounded-md p-2 w-full`}
                    placeholder="Venue"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className={`text-xs`}>
              {/* Cut the description to first 500 characteres */}
              {book.description?.slice(0, 500) + (book.description?.length > 500 ? '...' : '')}
            </div>
            <div className={`text-xs`}>
              {book.publishedDate}
            </div>
            <div className={`text-xs`}>
              <a href={book.url} target="_blank" rel="noreferrer">
                {book.url}
              </a>
            </div>
            {/* Add input for optional canonical url */}
            <input
              className={`border border-gray-300 rounded-md p-2 w-full mt-2`}
              placeholder="Canonical URL"
              value={canonicalUrl}
              onChange={e => setCanonicalUrl(e.target.value)}
            />
            <div className={`mt-2`}>
              <Button
                size="sm"
                secondary
                onClick={() => handleSaveBook(book)}
              >
                Save Book
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}