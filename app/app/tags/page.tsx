import Link from 'next/link';

import { Edit2 } from 'lucide-react';

import { getBookmarks } from 'app/actions/bookmarks';
import { getTags, getTagsWithBookmarkIds } from 'app/actions/tags';

import Card from 'components/card';
import Header from 'components/header';
import DeleteTag from 'components/tag/delete-tag';
import EditTag from 'components/tag/edit-tag';
import { Badge } from 'components/ui/badge';

import { groupByDate } from 'lib/data';
import { cn } from 'lib/utils';

import { BookmarkModifiedType } from 'types/data';

const title = 'Bookmark it. | Tags';
const description = 'Bookmark manager for the modern web.';

export const metadata = {
  title,
  description,
};

export default async function Page() {
  const tags = await getTags();
  const bookmarks = await getBookmarks();
  const groupedBookmarks = groupByDate(bookmarks);
  const groupedByTagId = await getTagsWithBookmarkIds();

  return (
    <>
      <Header headerText="Tags" />
      <div className="min-h-dvh border-r border-neutral-200 pb-24">
        {tags.length ? (
          <div className="flex gap-x-3 gap-y-2 items-end px-4 flex-wrap py-3">
            {tags.map(({ id, name }) => (
              <div key={id} className="inline-flex items-center">
                <Link className="flex items-center" href={`/tags/${name}`}>
                  <Badge className="font-normal py-1.5" variant="secondary">
                    {name} ({groupedByTagId[id]?.length ?? 0})
                  </Badge>
                </Link>
                <EditTag id={id} name={name} />
                <DeleteTag id={id} />
              </div>
            ))}
          </div>
        ) : null}
        {tags.length ? (
          <div className="border-b border-neutral-200 flex w-full pt-1" />
        ) : null}
        {Object.keys(groupedBookmarks).map((groupKey: any, index: number) => {
          const bookmarksData: BookmarkModifiedType[] =
            groupedBookmarks[groupKey];
          return (
            <div
              className={cn(`flex flex-col w-full`, {
                'border-b border-neutral-200': bookmarksData.length > 0,
              })}
              key={index}
            >
              {bookmarksData.map((bookmark: BookmarkModifiedType) => (
                <Card key={bookmark.id} tags={tags} data={bookmark} />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
