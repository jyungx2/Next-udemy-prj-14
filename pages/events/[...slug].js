import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

// import { getFilteredEvents } from "../../dummy-data";
import { getFilteredEvents } from "../../helpers/api-utils";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
import { notFound, redirect } from "next/navigation";

function FilteredEventsPage() {
  const router = useRouter();
  const [loadedEvents, setLoadedEvents] = useState();

  const filterData = router.query.slug;
  console.log(filterData);

  const { data, error } = useSWR(
    "https://nextjs-course-7bf07-default-rtdb.firebaseio.com/events.json",
    (url) => fetch(url).then((res) => res.json())
  );
  console.log("Raw SWR Data:", data);

  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }

      setLoadedEvents(events);
    }
  }, [data]);

  console.log("SWR Data:", data);
  console.log("SWR Error:", error);

  if (!loadedEvents) {
    return <p className="center">Loading...</p>;
  }

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12 ||
    error
  ) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth);

  return (
    <Fragment>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

/*
export async function getServerSideProps(context) {
  const { params } = context;

  const filterData = params.slug;

  const filteredYear = filterData[0];
  const filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
  ) {
    return (
      // getServerSideProps() 함수는 서버 상에서만 실행되기 때문에, 유효성검사가 실패했을 때, JSX코드 반환 불가능!! 오직 오브젝트만을 반환할 수 있다!!
      {
        props: {
          hasError: true, // 위의 리액트 컴포넌트 함수(FilteredEventsPage) 안에서 props.hasError: true일 때, 404페이지 대신 직접 작성한 에러 JSX코드를 반환하도록
        },
        // notFound: true, // 404페이지 반환
        // redirect: { destination: "/error" }
      }
      // <Fragment>
      //   <ErrorAlert>
      //     <p>Invalid filter. Please adjust your values!</p>
      //   </ErrorAlert>
      //   <div className="center">
      //     <Button link="/events">Show All Events</Button>
      //   </div>
      // </Fragment>
    );
  }

  const filteredEvents = await getFilteredEvents({
    year: numYear,
    month: numMonth,
  });

  return {
    props: {
      events: filteredEvents,
      date: {
        year: numYear,
        month: numMonth,
      },
    },
  };
}
*/

export default FilteredEventsPage;
