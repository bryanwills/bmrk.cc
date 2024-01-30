import CardSkeleton from 'components/card/skeleton';
import Header from 'components/header';

export default function Loading() {
  return (
    <>
      <Header headerText="Favorites" />
      <div className="min-h-dvh border-r border-neutral-200">
        <CardSkeleton />
        <CardSkeleton className="border-b border-neutral-200" />
      </div>
    </>
  );
}
