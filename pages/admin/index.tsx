import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '@/context/store';
import Button from '@/components/button';
import Dropdown from '@/components/dropdown';
import { Toaster, toast } from 'sonner'

export default function Admin() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [taskShowing, setTaskShowing] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [venue, setVenue] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const { user } = useContext(GlobalContext);
  const router = useRouter();

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
    } catch (error) {
      toast.error('Error saving book');
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
        <div className={`mt-4`}>
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
        </div>
      </div>
      <div>
        {searchResults.map((book, index) => (
          <div key={index} className={`mt-4`}>
            <div className={`text-lg font-medium`}>
              {book.title}
            </div>
            <div className={`text-sm`}>
              {book.authors && book.authors.join(', ')}
            </div>
            <div className={`text-xs`}>
              {/* Cut the description to first 500 characteres */}
              {book.description?.slice(0, 500) + (book.description?.length > 500 ? '...' : '')}
            </div>
            <div className={`text-xs`}>
              {book.venue}
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