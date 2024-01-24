import { getBookmarksWithFilter } from 'app/actions/bookmarks';
import { Bookmark, BookmarkModified } from 'types/data';

import AddBookmarkInput from 'components/bookmark/add-input';
import Card from 'components/card';
import Header from 'components/header';

export default async function Page() {
  const bookmarks = await getBookmarksWithFilter({ is_fav: true });

  return (
    <>
      <Header headerText="Settings" />
      <div className="min-h-dvh border-r border-neutral-200">
        {bookmarks.map((bookmark: BookmarkModified) => (
          <Card key={bookmark.id} data={bookmark} />
        ))}
      </div>
    </>
  );
}