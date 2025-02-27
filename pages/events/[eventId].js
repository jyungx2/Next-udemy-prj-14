import { Fragment } from "react";
// import { useRouter } from "next/router";

// import { getEventById } from "../../dummy-data";
import { getEventById, getAllEvents } from "../../helpers/api-utils";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import ErrorAlert from "../../components/ui/error-alert";

function EventDetailPage(props) {
  // const router = useRouter();

  // const eventId = router.query.eventId;
  // const event = getEventById(eventId);
  const event = props.selectedEvent;

  if (!event) {
    return (
      <ErrorAlert>
        <p>No event found!</p>
      </ErrorAlert>
    );
  }

  return (
    <Fragment>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;

  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event,
    },
  };
}

export async function getStaticPaths() {
  const events = await getAllEvents();
  const paths = events.map((event) => ({ params: { eventId: event.id } }));

  return {
    paths: paths,
    fallback: false, // specify하지 않은 unknown id로 접속한다면 404페이지 반환하도록 false로 설정..(명시하지 않은 페이지까지 동적으로 보여주려면 true(페이지 만드는데 시간 걸리므로 그동안 로딩페이지 보여줌) or 'blocking'(로딩페이지 없이, 데이터 준비될 때까지 기다렸다가 완전히 생성된 페이지를 한번에 뿌림)으로 설정)
  };
}

export default EventDetailPage;
