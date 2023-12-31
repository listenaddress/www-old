import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '@/context/store';
import Button from '@/components/button';
import Dropdown from '@/components/dropdown';
import { Toaster, toast } from 'sonner'
import { extractSpotifyShowId, extractItunesPodcastId, extractYoutubeChannelIdOrName } from '@/lib/helpers';

export default function Admin() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [taskShowing, setTaskShowing] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [podcastUrl, setPodcastUrl] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [ssAuthorUrl, setSSAuthorUrl] = useState('');
  const [ssAuthorPaperUrl, setSSAuthorPaperUrl] = useState('');
  const [paperUrl, setPaperUrl] = useState(''); // TODO: Add paper url input
  const [pinnedSpotifyPodcasts, setPinnedSpotifyPodcasts] = useState([]);
  const [pinnedItunesPodcasts, setPinnedItunesPodcasts] = useState([]);
  const [pinnedYoutubeChannels, setPinnedYoutubeChannels] = useState([]);
  const [pinnedSemanticScholarAuthors, setPinnedSemanticScholarAuthors] = useState([]);
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
    const semanticScholarAuthors = resJson.filter((item: any) => item.type === 'ss_author')
    const rssFeeds = resJson.filter((item: any) => item.type === 'rss_feed')
    setPinnedSpotifyPodcasts(spotifyPodcasts)
    setPinnedItunesPodcasts(itunesPodcasts)
    setPinnedYoutubeChannels(youtubeChannels)
    setPinnedRssFeeds(rssFeeds)
    setPinnedSemanticScholarAuthors(semanticScholarAuthors)
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
    const additional_urls = [];
    if (canonicalUrl) additional_urls.push(book.url);
    const data = {
      title: book.title,
      authors: book.authors.map((author: any) => ({ name: author })),
      description: book.description,
      external_ids: book.externalIds,
      venue: bookVenue,
      created_at: book.publishedDate,
      url: canonicalUrl ? canonicalUrl : book.url,
      type: 'book',
      additional_urls: additional_urls
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
    } catch (error: any) {
      if (error && error.error) toast.error(error.error);
      else toast.error('Error saving book');
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

  const handlePinYoutubeChannel = async () => {
    const idOrName: any = extractYoutubeChannelIdOrName(channelUrl);
    if (!idOrName || (!idOrName.id && !idOrName.name)) return toast.error('Invalid YouTube channel URL')
    let body: any = {
      type: 'youtube_channel',
    }
    if (idOrName.id) body = { ...body, external_id: idOrName.id }
    if (idOrName.name) body = { ...body, name: idOrName.name }
    const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pins`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessTokenFromCookie}`
        },
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success('YouTube channel pinned successfully');
        setChannelUrl('');
      } else {
        const resJson = await res.json()
        if (resJson.error) {
          toast.error(resJson.error)
        } else {
          toast.error('Error pinning YouTube channel');
        }
      }
    } catch (error) {
      toast.error('Error pinning YouTube channel');
    }
  }

  const handlePinItunesPodcast = async () => {
    const podcastId = podcastUrl.includes('podcasts.apple.com') ? extractItunesPodcastId(podcastUrl) : podcastUrl;

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
          type: 'itunes_podcast',
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
  }

  const handleSSAuthorPin = async () => {
    let authorId = ''
    // If there's no slash, it's just the id
    if (!ssAuthorUrl.includes('/')) {
      authorId = ssAuthorUrl
    } else {
      const idFromUrl = ssAuthorUrl.split('/author/')[1]
      if (idFromUrl) {
        authorId = idFromUrl.split('/')[1]
      } else {
        authorId = ssAuthorUrl
      }
    }

    const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pins`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessTokenFromCookie}`
        },
        method: 'POST',
        body: JSON.stringify({
          external_id: authorId,
          type: 'ss_author',
        }),
      });

      if (res.ok) {
        toast.success('Semantic Scholar author pinned successfully');
        setSSAuthorUrl('');
      } else {
        toast.error('Error pinning Semantic Scholar author');
      }
    } catch (error) {
      toast.error('Error pinning Semantic Scholar author');
    }
  }

  const handleSSAuthorPinByPaper = async () => {
    const paperSlugAndIdOrId = ssAuthorPaperUrl.split('/paper/')[1]
    const paperId = paperSlugAndIdOrId.includes('/') ? paperSlugAndIdOrId.split('/')[1] : paperSlugAndIdOrId

    const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pins/authors_from_paper`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessTokenFromCookie}`
      },
      method: 'POST',
      body: JSON.stringify({
        paper_id: paperId,
      }),
    });

    if (res.ok) {
      toast.success('Semantic Scholar authors pinned successfully');
      setSSAuthorPaperUrl('');
    } else {
      toast.error('Error pinning Semantic Scholar author');
    }
  }

  const handlePaperAuthorsPin = async () => {
    const accessTokenFromCookie = document.cookie.split('accessToken=')[1].split(';')[0]
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pins/authors_from_paper_url`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessTokenFromCookie}`
      },
      method: 'POST',
      body: JSON.stringify({
        url: paperUrl,
      })
    })

    if (res.status === 201) {
      toast.success('Paper authors pinned successfully');
      setPaperUrl('');
    } else {
      toast.error('Error pinning paper authors');
    }
  }

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
      text: 'Pin Paper Authors',
      onClick: () => setTaskShowing('pinPaperAuthors')
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
          {
            taskShowing === 'pinItunesPodcast' && (
              <div className={"mt-4"}>
                <input
                  className={"border border-gray-300 rounded-md p-2 w-full"}
                  placeholder="iTunes Podcast URL or ID"
                  value={podcastUrl}
                  onChange={e => setPodcastUrl(e.target.value)}
                />
                <div className={"mt-2"}>
                  <Button
                    size="sm"
                    secondary
                    onClick={handlePinItunesPodcast}
                  >
                    Pin iTunes Podcast
                  </Button>
                </div>
                {pinnedItunesPodcasts.length}
                {
                  pinnedItunesPodcasts.map((podcast: any, index: number) => (
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
          {
            taskShowing === 'pinYoutubeChannel' && (
              <div className={"mt-4"}>
                <input
                  className={"border border-gray-300 rounded-md p-2 w-full"}
                  placeholder="YouTube Channel URL"
                  value={channelUrl}
                  onChange={e => setChannelUrl(e.target.value)}
                />
                <div className={"mt-2"}>
                  <Button
                    size="sm"
                    secondary
                    onClick={handlePinYoutubeChannel}
                  >
                    Pin YouTube Channel
                  </Button>
                </div>
                {pinnedYoutubeChannels.length}
                {
                  pinnedYoutubeChannels.map((channel: any, index: number) => (
                    <div key={index} className={"mt-2"}>
                      <div className={"text-xs"}>
                        {index} - {channel.external_id}
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
          {
            taskShowing === 'pinSemanticScholarAuthor' && (
              <div className={"mt-4"}>
                <input
                  className={"border border-gray-300 rounded-md p-2 w-full"}
                  placeholder="Semantic Scholar Author URL or ID"
                  value={ssAuthorUrl}
                  onChange={e => setSSAuthorUrl(e.target.value)}
                />
                <div className={"mt-2"}>
                  <Button
                    size="sm"
                    secondary
                    onClick={handleSSAuthorPin}
                  >
                    Pin Semantic Scholar Author
                  </Button>
                </div>
                <div className={"mt-4"}>
                  <input
                    className={"border border-gray-300 rounded-md p-2 w-full"}
                    placeholder="Semantic Scholar Paper URL"
                    value={ssAuthorPaperUrl}
                    onChange={e => setSSAuthorPaperUrl(e.target.value)}
                  />
                  <div className={"mt-2"}>
                    <Button
                      size="sm"
                      secondary
                      onClick={handleSSAuthorPinByPaper}
                    >
                      Pin Semantic Scholar Author by Paper
                    </Button>
                  </div>
                </div>


                {pinnedSemanticScholarAuthors.length}
                {
                  pinnedSemanticScholarAuthors.map((author: any, index: number) => (
                    <div key={index} className={"mt-2"}>
                      <div className={"text-xs"}>
                        {index} - {author.external_id}
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
          {
            taskShowing === 'pinPaperAuthors' && (
              <div className={"mt-4"}>
                <input
                  className={"border border-gray-300 rounded-md p-2 w-full"}
                  placeholder="Paper URL"
                  value={paperUrl}
                  onChange={e => setPaperUrl(e.target.value)}
                />
                <div className={"mt-2"}>
                  <Button
                    size="sm"
                    secondary
                    onClick={handlePaperAuthorsPin}
                  >
                    Pin Paper Authors
                  </Button>
                </div>
                {pinnedSemanticScholarAuthors.length}
                {
                  pinnedSemanticScholarAuthors.map((author: any, index: number) => (
                    <div key={index} className={"mt-2"}>
                      <div className={"text-xs"}>
                        {index} - {author.external_id}
                      </div>
                    </div>
                  ))
                }
              </div>
            )
          }
          {
            taskShowing === 'pinRssFeed' && (
              <div className='mt-4 text-red-500'>
                Todo
              </div>
            )
          }
          {
            taskShowing === 'addBookManually' && (
              <div className={"mt-4 text-red-500"}>
                Todo
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